import type { Request, Response } from "express";
import { apiConfig } from "../configs/config.js";

export async function handlerIncrementHits(_: Request, res: Response): Promise<void> {
    res.status(200).send(`Hits: ${apiConfig.fileserverHits}`)
}

export async function handlerResetIncrementHits(_: Request, res: Response) {
    apiConfig.fileserverHits = 0;
    res.status(200).send("OK")
}