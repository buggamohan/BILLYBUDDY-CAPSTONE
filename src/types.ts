import React from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    district: string;
    city: string;
  };
  bullyingType: string;
  perpetratorInfo: {
    platform: string;
    username?: string;
    profileUrl?: string;
    realName?: string;
    approximateAge?: string;
    additionalDetails?: string;
  };
  evidenceLinks: string[];
  timestamp: Date;
  status: 'pending' | 'reported' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  isAnonymous: boolean;
}

export interface Question {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  createdAt: Date;
  answers: Answer[];
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Answer {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
  likes: number;
  isAdminResponse?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
  likes: number;
}

export interface Experience {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  comments: Comment[];
  likes: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  type?: 'input' | 'options';
  options?: string[];
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: 'prevention' | 'response' | 'awareness' | 'support';
  tags: string[];
}