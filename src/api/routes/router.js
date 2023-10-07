const express = require("express");
const router = express.Router();

// Pessoa router
const pessoaRouter = require("./pessoaRouter");
router.use("/", pessoaRouter);

module.exports = router;