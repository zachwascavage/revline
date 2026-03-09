export const syncUsersToBackend = async () => {
  try {
    const allUsers = JSON.parse(localStorage.getItem('revline_all_users') || '[]');
    if (allUsers.length > 0) {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: allUsers })
      });
      localStorage.removeItem('revline_all_users');
      localStorage.removeItem('revline_deleted_users');
    }
  } catch (err) {
    console.error('Failed to sync users', err);
  }
};

export const loginUser = async (email: string, password?: string) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
    return null;
  } catch (err) {
    console.error('Login failed', err);
    return null;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Registration failed', err);
    return { error: 'Registration failed' };
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch users', err);
    return [];
  }
};

export const deleteUser = async (email: string) => {
  try {
    await fetch(`/api/users/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete user', err);
  }
};

export const permanentDeleteUser = async (email: string) => {
  try {
    await fetch(`/api/users/${encodeURIComponent(email)}/permanent`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to permanent delete user', err);
  }
};

export const restoreUser = async (email: string) => {
  try {
    await fetch(`/api/users/${encodeURIComponent(email)}/restore`, {
      method: 'POST'
    });
  } catch (err) {
    console.error('Failed to restore user', err);
  }
};

export const deleteAllUsers = async (type: 'active' | 'deleted') => {
  try {
    await fetch(`/api/users?type=${type}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete all users', err);
  }
};
