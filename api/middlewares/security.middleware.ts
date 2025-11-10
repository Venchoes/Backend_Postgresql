import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de segurança que configura headers HTTP seguros
 * incluindo Content Security Policy (CSP) para permitir recursos
 * externos necessários (Google Fonts, etc.)
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy - permite fontes e estilos do Google Fonts
  // e outros recursos externos necessários para o frontend
  const csp = [
    "default-src 'self'",
    "font-src 'self' https://fonts.gstatic.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permite CORS (já configurado no app.ts mas reforça aqui)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
};
