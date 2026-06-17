export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Mock users - in a real app, this would come from a database and passwords would be hashed
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'Coordinator User',
    email: 'coordinator@example.com',
    role: 'COORDINATOR',
  },
  {
    id: '3',
    name: 'PI User',
    email: 'pi@example.com',
    role: 'PI',
  },
  {
    id: '4',
    name: 'Participant User',
    email: 'participant@example.com',
    role: 'PARTICIPANT',
  },
];

export interface Session {
  user: User;
  expires: string;
}

export async function signIn(email: string, password: string): Promise<User | null> {
  // In a real app, you would verify the password hash
  // For demo, we accept any password if the email exists
  const user = mockUsers.find((u) => u.email === email);
  if (user) {
    // For demo, we accept any non-empty password
    if (password) {
      return user;
    }
  }
  return null;
}

export async function getSession(): Promise<Session | null> {
  // In a real app, you would get the session from a token or database
  // For demo, we return a hardcoded session if there is a mock user in localStorage?
  // We'll implement a simple mock: if there is a user in sessionStorage, return it.
  // We'll leave this to be implemented in the context.
  return null;
}

export async function setSession(user: User): Promise<Session> {
  // In a real app, you would create a session and return a token
  // For demo, we just return a session with a fake expiry
  return {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };
}