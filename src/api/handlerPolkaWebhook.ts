import { Request, Response } from 'express';
import { upgradeUserToChirpyRed } from '../db/queries/users.js';
import { BadRequestError } from '../utils/errors.js';

export async function handlerPolkaWebhook(req: Request, res: Response) {
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