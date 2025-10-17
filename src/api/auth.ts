import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { UnauthorizedError } from '../utils/errors.js';

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    }
    const token =  jwt.sign(payload, secret)
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try{
        const decoded = jwt.verify(tokenString, secret);
        if (typeof decoded === 'string') throw new Error('Invalid token');
        if (typeof decoded.sub !== 'string') throw new Error('Invalid token');
        return decoded.sub;
    } catch {
        throw new Error('Invalid token');
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new UnauthorizedError("No Authorization header provided.");
    
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) throw new UnauthorizedError("Invalid Authorization header format. Must be a Bearer token. Example: 'Bearer <TOKEN>'");
    
    return token.trim();
}