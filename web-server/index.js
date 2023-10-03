const express = require("express");
const app = express();
const port = 3000;

// The data we will be sending is JSON, so this will help with that??? IDK what im doing :)
app.use(express.json());

// Listen on the given port
app.listen(port, () => {
    console.log("Server Listening on port ", port);
});

// Hello world test endpoint
app.get("/hello", (request, response) => {
    const hello_world = {
        "Message" : "Hello, world!"
    };

    response.send(hello_world);
});