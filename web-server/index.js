const express = require("express");
const example_router = require("./routes/example");
const question_router = require("./routes/question");
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
app.use("/question", question_router);

// Hello world test endpoint
app.get("/hello", (request, response) => {
    const hello_world = {
        "Message" : "Hello, world!"
    };

    response.send(hello_world);
});