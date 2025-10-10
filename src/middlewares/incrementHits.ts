import { Request, Response, NextFunction } from "express";
import { config } from "../configs.js";

export function middlewareIncrementHits(req: Request, _: Response, next: NextFunction) {
    // increment fileserverHits property from APIConfig type every time it's called
    config.api.fileserverHits++
    next();
}
