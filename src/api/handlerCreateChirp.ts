import type { NextFunction, Request, Response } from "express";
import { profaneWords } from "../configs.js";
import { BadRequestError } from "../utils/errors.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = { body: string, userId: string }
    const requestBody: parameters = req.body
    const chirpMessage = requestBody.body;
    const userId = requestBody.userId;

    if (!chirpMessage) throw new BadRequestError("Invalid request. Missing chirp's body.");

    if (!userId) throw new BadRequestError("Invalid request. Missing user's ID.");

    if (!isMaxChirpsLengthValid(chirpMessage)) throw new BadRequestError("Chirp is too long. Max length is 140");

    const cleanedChirpsMessage = removeProfane(chirpMessage);
    const result = await createChirp({ body: cleanedChirpsMessage, userId: userId })
    res.status(201).json(result)
} 

// export async function handlerValidateChirp(req: Request, res: Response) {

//     type parameters = { body: string }
//     const params: parameters = req.body;
//     let text = params.body;

//     if (!isMaxChirpsLengthValid(text)) {
//         throw new BadRequestError("Chirp is too long. Max length is 140")
//     }
//     res.status(200).send(JSON.stringify(
//         {
//             "cleanedBody": removeProfane(text)
//         }
//     ));
// }

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