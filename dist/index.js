import express from "express";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadiness);
async function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
}
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
