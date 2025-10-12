import express from "express"
import postgres from "postgres";
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'

import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerCreateChirp } from "./api/handlerCreateChirp.js";
import { handlerCreateUser } from "./api/handlerCreateUser.js";
import { handlerIncrementHits, handlerResetIncrementHits } from "./api/handlerIncrementHits.js";

import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncrementHits } from "./middlewares/incrementHits.js";
import { middlewareErrorHandler } from "./middlewares/errorHandler.js";
import { config } from "./configs.js";
import { handlerListChirps } from "./api/handlerListChirps.js";
import { handlerGetChirp } from "./api/handlerGetChirp.js";

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express();

// middlewares
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareIncrementHits, express.static("./src/app"));

// routes
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});

app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerListChirps(req, res)).catch(next)
});

app.get("/api/chirps/:chirpId",(req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res)).catch(next)
});

app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerCreateChirp(req, res)).catch(next)
});

app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next)
});

app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetIncrementHits(req, res)).catch(next)
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerIncrementHits(req, res)).catch(next)
});

// error-handling middleware
app.use(middlewareErrorHandler)

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}/app`);
})


