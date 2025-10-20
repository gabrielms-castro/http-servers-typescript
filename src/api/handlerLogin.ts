import type { Request, Response } from "express";

import { getUser } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { UserResponse } from "../db/schema.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

export async function handlerLogin(req: Request, res: Response) {
    type Parameters = { 
        email: string, 
        password: string,
    }
    const requestBody: Parameters = req.body;
    const email = requestBody.email
    const password = requestBody.password

    if (!email || !password) {
        throw new BadRequestError("Please provide an email and a password.")
    }
    
    const queryUser = await getUser(email)
    if (!queryUser) throw new UnauthorizedError('Incorrect email or password');

    const matching = await checkPasswordHash(password, queryUser.hashedPassword);
    if (!matching) {
        throw new UnauthorizedError('Incorrect email or password');
    }

    const jwtToken = makeJWT(queryUser.id, process.env.TOKEN_STRING!);
    const refreshToken = makeRefreshToken();

    await createRefreshToken({
        token: refreshToken,
        userId: queryUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days
        revokedAt: null,
    })

    res.status(200).json({
        id: queryUser.id,
        email: queryUser.email,
        isChirpyRed: queryUser.isChirpyRed,
        createdAt: queryUser.createdAt,
        updatedAt: queryUser.updatedAt,
        token: jwtToken,
        refreshToken: refreshToken
    } satisfies UserResponse & { token: string, refreshToken: string });
}