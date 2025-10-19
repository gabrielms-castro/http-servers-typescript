import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { UnauthorizedError } from '../utils/errors.js';
import { randomBytes } from 'crypto';

const TOKEN_ISSUER = "chirpy";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, secret: string, expiresIn: number = 3600): string {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: iat,
        exp: iat + expiresIn
    }
    const token =  jwt.sign(payload, secret)
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: Payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new UnauthorizedError('Invalid token.');
    }

    if (decoded.iss !== TOKEN_ISSUER) throw new UnauthorizedError('Invalid issuer.');
    if (!decoded.sub) throw new UnauthorizedError('No user ID in token.')

    return decoded.sub;
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new UnauthorizedError("No Authorization header provided.");
    
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) throw new UnauthorizedError("Invalid Authorization header format. Must be a Bearer token. Example: 'Bearer <TOKEN>'");
    
    return token.trim();
}

export function makeRefreshToken() {
    const buf = randomBytes(32)
    return buf.toString('hex');
}