import type { Request, Response } from "express";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequestError } from "../utils/errors.js";
import { hashPassword } from "./auth.js";
import { Result } from "drizzle-orm/sqlite-core/session.js";
import { NewUser, UserResponse } from "src/db/schema.js";


export async function handlerCreateUser(req: Request, res: Response) {
    type Parameters = { email: string, password: string }
    
    const requestBody: Parameters = req.body;
    const email = requestBody.email;
    const password = requestBody.password;
    const hashedPwsd = await hashPassword(password)

    if (!email.match(/\w+@\w+/g)) {
        throw new BadRequestError(`Invalid E-mail.`)
    }

    const userSearch = await getUser(email);
    if (userSearch) {
        throw new BadRequestError(`E-mail ${email} is already in use.`);
    }

    const result = await createUser({ email: email, hashedPassword: hashedPwsd } satisfies NewUser)
    if (!result) {
        throw new Error("Could not create a user.")
    }

    if (result) {
        res.status(201).json({
            id: result.id,
            email: result.email,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        } satisfies UserResponse)
    }
}