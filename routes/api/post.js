const express = require('express');
const routes = express.Router();


routes.get('/',(req,res)=>{
    res.json({message : 'hello post'});
});

module.exports = routes;