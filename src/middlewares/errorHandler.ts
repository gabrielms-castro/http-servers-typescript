import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../utils/errors.js";

export async function middlewareErrorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    console.log(err)

    if (err instanceof BadRequestError) {
        return res.status(400).send(JSON.stringify({
            "error": "Chirp is too long. Max length is 140"
        }));
    } else {
        return res.status(500).send(JSON.stringify({
            "error": "Something went wrong on our end"
        }));
    }
}
