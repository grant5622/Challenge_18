const express = require ("express");

const database = require ("./config/connection");

const routes = require ("./routes");

const app = express ();

const PORT = process.env.PORT||3001;

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(routes);

database.once("open",()=>{
    app.listen(PORT,()=>{
        console.log(`server running on PORT ${PORT}`)
    });
});
