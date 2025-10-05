import type { Request, Response } from "express";
import { profaneWords } from "./configs.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    }
    const params: parameters = req.body;
    let text = params.body;

    if (!isMaxChirpsLengthValid(text)) {
        res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }))
        return;
    }
    res.status(200).send(JSON.stringify({ "cleanedBody": removeProfame(text) }))
}

function isMaxChirpsLengthValid(text: string, maxChirpLength: number = 140): boolean {
    if (!text) throw new Error(`Invalid text: ${text}`);
    if (text.length > maxChirpLength) return false;
    return true;
}

function removeProfame(text: string): string {
    const textArray = text.split(" ");

    for (let i=0; i < textArray.length; i++) {
        let word = textArray[i].toLowerCase()
        if (profaneWords.includes(word)) {
            textArray[i] = "****";
        }
    }
    const cleanedText = textArray.join(" ")
    return cleanedText
}