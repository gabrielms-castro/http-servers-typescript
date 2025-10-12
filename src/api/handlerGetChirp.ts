import { Request, Response } from 'express'
import { getChirp } from '../db/queries/chirps.js';
import { BadRequestError } from '../utils/errors.js';

export async function handlerGetChirp(req: Request, res: Response) {
    // type parameters = { chirpId: string };
    const chirpId = req.params.chirpId;
    const result = await getChirp(chirpId);
    if (!result) {
        throw new BadRequestError(`Cannot find chirp by ID ${chirpId}`)
    }
    res.status(200).json(result)
}