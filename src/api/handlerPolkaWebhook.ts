import { Request, Response } from 'express';
import { upgradeUserToChirpyRed } from '../db/queries/users.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import { getApiKey } from './auth.js';
import { config } from '../configs.js';

export async function handlerPolkaWebhook(req: Request, res: Response) {
    const key = getApiKey(req);
    if (key !== config.api.polkaKey) throw new UnauthorizedError("Invalid API key.");

    type Parameters = {
        event: string;
        data: {
            userId: string;
        }
    }
    const requestBody: Parameters = req.body;
    const userId = requestBody.data.userId;
    if (requestBody.event !== "user.upgraded") return res.sendStatus(204);

    const result = await upgradeUserToChirpyRed(userId);
    if (!result) throw new BadRequestError("Could not upgrade user to Chirpy Red.");

    return res.sendStatus(204)
}