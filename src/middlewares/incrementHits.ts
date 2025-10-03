import { Request, Response, NextFunction } from "express";
import { apiConfig } from "../configs/config.js";

export function middlewareIncrementHits(req: Request, _: Response, next: NextFunction) {
    // increment fileserverHits property from APIConfig type every time it's called
    apiConfig.fileserverHits++
    next();
}
