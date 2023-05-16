const express = require("express");
const debug  = require("debug")("app:t_debug");
const app = express();

app.use(express.json());
//app.use(express.urlencoded());

app.get("/",(req,res)=>{
    debug("auth_token= ",req.query.auth_token);
    debug("feed_token= ",req.query.feed_token);
    debug("refresh_token= ",req.query.refresh_token);
    debug("req",req.body);
    res.status(200).send("Jai balayya");
});

app.listen(8000,()=>debug("Server started at http://localhost:8000/"));