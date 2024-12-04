import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Initialize admin account if not exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.some((u: User) => u.email === 'admin@gmail.com')) {
      const adminPassword = 'Admin@6202';
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      const adminUser: User = {
        id: uuidv4(),
        username: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date()
      };
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to the previous page or home
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const signup = async (username: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};