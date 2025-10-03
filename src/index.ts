import express from "express"
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerIncrementHits, handlerResetIncrementHits } from "./api/handlerIncrementHits.js";

import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncrementHits } from "./middlewares/incrementHits.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareIncrementHits)

app.use("/app", express.static("./src/app"))

// middlewares
app.use(middlewareLogResponses)

// routes
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerIncrementHits);
app.get("/reset", handlerResetIncrementHits);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
})


