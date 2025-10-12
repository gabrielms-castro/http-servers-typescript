import type { Request, Response } from "express";
import { config } from "../configs.js";
import { deleteUsers } from "../db/queries/users.js";
import { ForbiddenError } from "../utils/errors.js";

export async function handlerIncrementHits(_: Request, res: Response): Promise<void> {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
<html>
<body>
<h1>Welcome, Chirpy Admin</h1>
<p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
</body>
</html>
`);
}

export async function handlerResetIncrementHits(_: Request, res: Response) {
    if (config.api.platform !== 'dev') {
      throw new ForbiddenError("Forbidden Endpoint.")
    }
    await deleteUsers()
    config.api.fileserverHits = 0;
    res.write("Hits reset to 0");
    res.end()
}

