import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || "MEDICORE_JWT_SUPER_SECRET_KEY_FALLBACK";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    name: string;
    profileId?: string;
  };
}

export function generateToken(payload: {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  profileId?: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required. Please sign in." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Session expired or invalid. Please re-authenticate." });
    }
    req.user = user;
    next();
  });
}

export function requireRole(roles: ('patient' | 'doctor' | 'admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access Denied: Insufficient authorization permissions." });
    }
    next();
  };
}
