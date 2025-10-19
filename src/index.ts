import express from "express"
import postgres from "postgres";
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'

import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerCreateChirp } from "./api/handlerCreateChirp.js";
import { handlerCreateUser } from "./api/handlerCreateUser.js";

import { 
    handlerIncrementHits, 
    handlerResetIncrementHits 
} from "./api/handlerIncrementHits.js";

import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncrementHits } from "./middlewares/incrementHits.js";
import { middlewareErrorHandler } from "./middlewares/errorHandler.js";
import { config } from "./configs.js";
import { handlerListChirps } from "./api/handlerListChirps.js";
import { handlerGetChirp } from "./api/handlerGetChirp.js";
import { handlerLogin } from "./api/handlerLogin.js";
import { handlerRefreshTokens, handlerRevokeRefreshTokens } from "./api/handlerRefreshTokens.js";
import { handlerEditUserCredentials } from "./api/handlerEditUserCredentials.js";
import { handlerDeleteChirp } from "./api/handlerDeleteChirp.js";

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express();

/////////////////
// middlewares //
///////////////// 
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareIncrementHits, express.static("./src/app"));

////////////////
//   routes   //
//////////////// 

// system health
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});

// chirps
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerListChirps(req, res)).catch(next)
});
app.get("/api/chirps/:chirpId",(req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res)).catch(next)
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerCreateChirp(req, res)).catch(next)
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
})

// users
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next)
});
app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerEditUserCredentials(req, res)).catch(next)
})

// login //
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next)
});

// refresh token //
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefreshTokens(req, res)).catch(next)
})
app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(handlerRevokeRefreshTokens(req, res)).catch(next)
})

// admin //
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetIncrementHits(req, res)).catch(next)
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerIncrementHits(req, res)).catch(next)
});

///////////////////
// error-handler //
/////////////////// 
app.use(middlewareErrorHandler)

///////////////
// listening //
/////////////// 
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}/app`);
})


