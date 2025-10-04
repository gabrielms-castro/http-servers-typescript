import type { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    }
    const params: parameters = req.body;
    const maxChirpsLength = 140;
    if (params.body.length > maxChirpsLength) {
        res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }))
        return;
    }
    res.status(200).send(JSON.stringify({ "valid": true }))
}