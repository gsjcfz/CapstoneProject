# Web Server

API endpoints will be .js files in the `routes` directory.
Each endpoint exports an express.Router() object, which is imported in `index.js`,
where it is bound to its respective request path using `app.use(path, router)`.
Routers receive requests, call functions in the `services` directory, and
handle dispatching responses.

Files in the `services` directory export functions for use elsewhere. It's
here that server logic actually takes place: SQL queries, data processing, etc.

Short descriptions on `config.js` and `helper.js` can be found as a comment
in the respective files. Note: Node doesn't have special logic relating to these
files. If you want to use what's in them in other files you still have to export
and import.