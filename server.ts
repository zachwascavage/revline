import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Setup ---
let db: any = null;
let isMongo = false;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  businessName: String,
  phoneNumber: String,
  password: { type: String, select: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: String,
  userEmail: { type: String, default: null },
  userName: { type: String, default: null },
  summary: String,
  messages: [{ role: String, text: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

let UserModel: any = null;
let ChatSessionModel: any = null;

async function initDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (mongoUri) {
    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      console.warn("Invalid MONGODB_URI scheme. Expected connection string to start with 'mongodb://' or 'mongodb+srv://'. Falling back to SQLite.");
    } else {
      try {
        await mongoose.connect(mongoUri);
        UserModel = mongoose.model('User', userSchema);
        ChatSessionModel = mongoose.model('ChatSession', chatSessionSchema);
        isMongo = true;
        console.log("Connected to MongoDB for central user storage.");
        return;
      } catch (err) {
        console.error("MongoDB connection failed, falling back to SQLite:", err);
      }
    }
  }
  
  // Fallback to SQLite
  console.log("Using local SQLite database in temp directory.");
  const dbPath = path.join(os.tmpdir(), "database.sqlite");
  db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      businessName TEXT,
      phoneNumber TEXT,
      password TEXT,
      isAdmin BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      deletedAt DATETIME
    );
  `);

  // Ensure phoneNumber column exists (migration for existing databases)
  try {
    db.exec("ALTER TABLE users ADD COLUMN phoneNumber TEXT");
  } catch (e) {
    // Column likely already exists, ignore error
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT UNIQUE,
      userEmail TEXT,
      userName TEXT,
      summary TEXT,
      messages TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function startServer() {
  await initDB();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    const { firstName, lastName, email, businessName, phoneNumber, password, isAdmin } = req.body;
    try {
      if (isMongo) {
        const user = new UserModel({ firstName, lastName, email, businessName, phoneNumber, password, isAdmin: false }); // Force isAdmin false for public registration
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ success: true, user: userObj });
      } else {
        const stmt = db.prepare("INSERT INTO users (firstName, lastName, email, businessName, phoneNumber, password, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)");
        const result = stmt.run(firstName, lastName, email, businessName, phoneNumber, password, 0); // Force isAdmin 0 for public registration
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
      }
    } catch (error: any) {
      if (isMongo && error.code === 11000) {
        res.status(400).json({ error: "Email already exists" });
      } else if (!isMongo && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (isMongo) {
        const user = await UserModel.findOne({ email, deletedAt: null }).select('+password').lean();
        if (!user || user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
      } else {
        const user = db.prepare("SELECT * FROM users WHERE email = ? AND deletedAt IS NULL").get(email) as any;
        if (!user || user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      if (isMongo) {
        const users = await UserModel.find().select('-password').lean();
        res.json(users);
      } else {
        const users = db.prepare("SELECT id, firstName, lastName, email, businessName, phoneNumber, isAdmin, createdAt, deletedAt FROM users").all();
        res.json(users);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/users/sync", async (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ error: "Invalid data" });
    
    let added = 0;
    try {
      if (isMongo) {
        for (const u of users) {
          const exists = await UserModel.findOne({ email: u.email });
          if (!exists) {
            await UserModel.create({
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              businessName: u.businessName || '',
              phoneNumber: u.phoneNumber || '',
              password: u.password,
              isAdmin: u.isAdmin,
              createdAt: u.createdAt || new Date(),
              deletedAt: u.deletedAt || null
            });
            added++;
          }
        }
      } else {
        const insert = db.prepare("INSERT OR IGNORE INTO users (firstName, lastName, email, businessName, phoneNumber, password, isAdmin, createdAt, deletedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        const transaction = db.transaction((usersToSync: any[]) => {
          for (const u of usersToSync) {
            const result = insert.run(
              u.firstName, u.lastName, u.email, u.businessName || '', u.phoneNumber || '',
              u.password, u.isAdmin ? 1 : 0, u.createdAt || new Date().toISOString(), u.deletedAt || null
            );
            if (result.changes > 0) added++;
          }
        });
        transaction(users);
      }
      res.json({ success: true, added });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/users/:email", async (req, res) => {
    const { email } = req.params;
    try {
      if (isMongo) {
        await UserModel.updateOne({ email }, { deletedAt: new Date() });
      } else {
        db.prepare("UPDATE users SET deletedAt = CURRENT_TIMESTAMP WHERE email = ?").run(email);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/users/:email/restore", async (req, res) => {
    const { email } = req.params;
    try {
      if (isMongo) {
        await UserModel.updateOne({ email }, { deletedAt: null });
      } else {
        db.prepare("UPDATE users SET deletedAt = NULL WHERE email = ?").run(email);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/users/:email/permanent", async (req, res) => {
    const { email } = req.params;
    try {
      if (isMongo) {
        await UserModel.deleteOne({ email });
      } else {
        db.prepare("DELETE FROM users WHERE email = ?").run(email);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/users", async (req, res) => {
    const { type } = req.query;
    try {
      if (isMongo) {
        if (type === 'deleted') {
          await UserModel.deleteMany({ deletedAt: { $ne: null } });
        } else {
          await UserModel.updateMany(
            { deletedAt: null, email: { $ne: 'admin@revline.hub' } },
            { deletedAt: new Date() }
          );
        }
      } else {
        if (type === 'deleted') {
          db.prepare("DELETE FROM users WHERE deletedAt IS NOT NULL").run();
        } else {
          db.prepare("UPDATE users SET deletedAt = CURRENT_TIMESTAMP WHERE deletedAt IS NULL AND email != 'admin@revline.hub'").run();
        }
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/chat-sessions", async (req, res) => {
    const { sessionId, userEmail, userName, messages, summary } = req.body;
    try {
      if (isMongo) {
        await ChatSessionModel.findOneAndUpdate(
          { sessionId },
          { userEmail, userName, messages, summary, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      } else {
        const existing = db.prepare("SELECT * FROM chat_sessions WHERE sessionId = ?").get(sessionId);
        if (existing) {
          db.prepare("UPDATE chat_sessions SET userEmail = ?, userName = ?, messages = ?, summary = ?, updatedAt = CURRENT_TIMESTAMP WHERE sessionId = ?")
            .run(userEmail, userName, JSON.stringify(messages), summary, sessionId);
        } else {
          db.prepare("INSERT INTO chat_sessions (sessionId, userEmail, userName, messages, summary) VALUES (?, ?, ?, ?, ?)")
            .run(sessionId, userEmail, userName, JSON.stringify(messages), summary);
        }
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/chat-sessions", async (req, res) => {
    try {
      if (isMongo) {
        const sessions = await ChatSessionModel.find().sort({ updatedAt: -1 }).lean();
        res.json(sessions);
      } else {
        const sessions = db.prepare("SELECT * FROM chat_sessions ORDER BY updatedAt DESC").all();
        const parsedSessions = sessions.map((s: any) => ({
          ...s,
          messages: JSON.parse(s.messages)
        }));
        res.json(parsedSessions);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
