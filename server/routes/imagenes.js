const express = require("express");

const fs = require("fs");
const path = require("path");
const { param } = require("./usuario");
const { verificaTokenImg } = require("../middlewares/autenticacion");

const app = express();

app.get("/imagen/:tipo/:id", verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${id}`);

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");
    res.sendFile(noImagePath);
  }
});

module.exports = app;
