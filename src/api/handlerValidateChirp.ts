import type { NextFunction, Request, Response } from "express";
import { profaneWords } from "./configs.js";
import { BadRequestError } from "../utils/errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {

    type parameters = { body: string }
    const params: parameters = req.body;
    let text = params.body;

    if (!isMaxChirpsLengthValid(text)) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }
    res.status(200).send(JSON.stringify(
        {
            "cleanedBody": removeProfane(text)
        }
    ));
}

function isMaxChirpsLengthValid(text: string, maxChirpLength: number = 140): boolean {
    if (!text) throw new Error(`Invalid text: ${text}`);
    if (text.length > maxChirpLength) return false;
    return true;
}

function removeProfane(text: string): string {
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