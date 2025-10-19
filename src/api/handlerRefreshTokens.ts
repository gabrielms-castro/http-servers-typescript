import type { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { getBearerToken, makeJWT } from "./auth.js";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";

export async function handlerRefreshTokens(req: Request, res: Response) {

    const authHeader = req.get("Authorization");
    if (!authHeader) throw new BadRequestError("No Authorization header provided.");

    const token = getBearerToken(req);
    const queryRefreshToken = await getRefreshToken(token);

    if (!queryRefreshToken) throw new UnauthorizedError("Invalid refresh token.");
    if (queryRefreshToken.expiresAt < new Date()) throw new UnauthorizedError("Refresh token has expired.");
    if (queryRefreshToken.revokedAt) throw new UnauthorizedError("Refresh token has been revoked.");
    if (!queryRefreshToken.userId) throw new UnauthorizedError("Invalid refresh token.");

    const jwtToken = makeJWT(queryRefreshToken.userId, process.env.TOKEN_STRING!);

    res.status(200).json({
        token: jwtToken
    })
}       

export async function handlerRevokeRefreshTokens(req: Request, res: Response) {
    const authHeader = req.get("Authorization");

    if (!authHeader) throw new BadRequestError("No Authorization header provided.");

    const token = getBearerToken(req);  
    const revoke = await revokeRefreshToken(token, new Date());
    res.status(204).send('OK')
    
}       