import type { Request, Response } from "express";
import { listAllChirps, listAllChirpsByUser } from "../db/queries/chirps.js";

export async function handlerListChirps(req: Request, res: Response) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;

    let sort = req.query.sort;

    if (sort === "asc") {
        const result = await listAllChirps();
        return res.status(200).json(result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
    } else if (sort === "desc") {
        const result = await listAllChirps();
        return res.status(200).json(result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }

    if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
    }

    if (authorId) {
        const result = await listAllChirpsByUser(authorId);
        return res.status(200).json(result);
    } else {
        const result = await listAllChirps();
        res.status(200).json(result);
    }
}
