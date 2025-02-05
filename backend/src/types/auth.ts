import { Request } from 'express';

interface AuthUser {
  user_id: number;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
} 