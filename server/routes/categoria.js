const express = require("express");
const Categoria = require("../models/categoria");

const {
  verificarToken,
  verificarAdmin_Role,
} = require("../middlewares/autenticacion");
const { isRegExp } = require("underscore");

const app = express();

// ========================================
// Mostrar todas las categorias
// ========================================
app.get("/categoria", verificarToken, function (req, res) {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

// ========================================
// Mostrar una categoria por id
// ========================================
app.get("/categoria/:id", verificarToken, function (req, res) {
  // Categoria.findById()
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no es correcto",
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ========================================
// Crear nueva categoria
// ========================================
app.post("/categoria", verificarToken, function (req, res) {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ========================================
// Actualiza la categoria
// ========================================
app.put("/categoria/:id", verificarToken, function (req, res) {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// ========================================
// Delete de la categoria
// ========================================
app.delete(
  "/categoria/:id",
  [verificarToken, verificarAdmin_Role],
  function (req, res) {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Categoria borrada",
      });
    });
  }
);

module.exports = app;
