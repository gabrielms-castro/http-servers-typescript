import { Request, Response, NextFunction } from "express"
import { 
    BadRequestError, 
    ForbiddenError, 
    NotFoundError, 
    UnauthorizedError,

} from "../utils/errors.js";

export async function middlewareErrorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    console.log(err)

    let statusCode = 500;
    let message =  "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message
    } else if ( err instanceof UnauthorizedError) {
        statusCode = 401;
        message = err.message;
    } else if ( err instanceof ForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if ( err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    res.status (400).send(JSON.stringify(
        {
            "error": message
        }
    ));
}
