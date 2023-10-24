require("dotenv").config({path: "./.env"});
const express = require("express");
const example_router = require("./routes/example");
const packRouter = require("./routes/pack");
const leaderboard_router = require("./routes/leaderboard");
const score_router = require("./routes/playerscore");
const app = express();
const port = 3000;

// The data we will be sending is JSON, so this will help with that??? IDK what im doing :)
app.use(express.json());
// This may help sanitize input
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Listen on the given port
app.listen(port, () => {
    console.log("Server Listening on port ", port);
});

app.use("/example", example_router);
app.use("/pack", packRouter);
app.use("/leaderboard", score_router);
app.use("/playerscore", score_router);

// Hello world test endpoint
app.get("/hello", (request, response) => {
    const hello_world = {
        "Message" : "Hello, world!"
    };

    response.send(hello_world);
});