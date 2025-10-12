import type { Request, Response } from "express";
import { listAllChirps } from "../db/queries/chirps.js";

export async function handlerListChirps(_: Request, res: Response) {
    const result = await listAllChirps();
    res.status(200).json(result);
}
