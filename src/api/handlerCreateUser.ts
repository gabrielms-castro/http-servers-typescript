import type { Request, Response } from "express";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequestError } from "../utils/errors.js";


export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = { email: string }
    const requestBody: parameters = req.body;
    const email = requestBody.email;

    if (!email.match(/\w+@\w+/g)) {
        throw new BadRequestError(`Invalid E-mail.`)
    }

    const userSearch = await getUser(email);
    if (userSearch) {
        throw new BadRequestError(`E-mail ${email} is already in use.`);
    }

    const result = await createUser(email)
    res.status(201).json(result)
}