import type { Request, Response } from "express";
import { apiConfig } from "./configs.js";

export async function handlerIncrementHits(_: Request, res: Response): Promise<void> {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
<html>
<body>
<h1>Welcome, Chirpy Admin</h1>
<p>Chirpy has been visited ${apiConfig.fileserverHits} times!</p>
</body>
</html>
`);
}

export async function handlerResetIncrementHits(_: Request, res: Response) {
    apiConfig.fileserverHits = 0;
    res.write("Hits reset to 0");
    res.end()
}

