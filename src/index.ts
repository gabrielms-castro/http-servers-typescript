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
app.get("/api/healthz", handlerReadiness);

//admin
app.get("/admin/reset", handlerResetIncrementHits);
app.get("/admin/metrics", handlerIncrementHits);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/app`);
})


