import express from "express"
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerValidateChirp } from "./api/handlerValidateChirp.js";
import { handlerIncrementHits, handlerResetIncrementHits } from "./api/handlerIncrementHits.js";

import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncrementHits } from "./middlewares/incrementHits.js";

const app = express();
const PORT = 8080;


// middlewares
app.use(middlewareLogResponses);
app.use(express.json());

    // routes
app.use("/app", middlewareIncrementHits, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

//admin
app.post("/admin/reset", handlerResetIncrementHits);
app.get("/admin/metrics", handlerIncrementHits);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
})


