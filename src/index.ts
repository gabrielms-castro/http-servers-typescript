import express from "express"
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerValidateChirp } from "./api/handlerValidateChirp.js";
import { handlerIncrementHits, handlerResetIncrementHits } from "./api/handlerIncrementHits.js";

import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncrementHits } from "./middlewares/incrementHits.js";
import { middlewareErrorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = 8080;


// middlewares
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareIncrementHits, express.static("./src/app"));

// routes
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});

app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next)
});

app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetIncrementHits(req, res)).catch(next)
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerIncrementHits(req, res)).catch(next)
});

// error-handling middleware
app.use(middlewareErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
})


