import {Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { deleteChirp, getChirp } from "../db/queries/chirps.js";

export async function handlerDeleteChirp(req: Request, res: Response) {
    // check auth
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new UnauthorizedError("No Authorization header provided.");

    const token = getBearerToken(req);
    const sub = validateJWT(token, process.env.TOKEN_STRING!) //subscriber is USER ID
    
    const chirpId = req.params.chirpId;
    if (!chirpId) throw new BadRequestError("Please provide a valid chirp ID.");
    
    const queryChirp = await getChirp(chirpId);
    if (!queryChirp) throw new NotFoundError(`Cannot find chirp ${chirpId}`);

    if (queryChirp.userId !== sub) throw new ForbiddenError("You are not allowed to delete this chirp.");
    const result = await deleteChirp(chirpId);

    return res.status(204).send("Deleted")
}