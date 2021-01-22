const express = require("express");
const Producto = require("../models/producto");

const { verificarToken } = require("../middlewares/autenticacion");

const app = express();

// ========================================
// Obtener productos
// ========================================
app.get("/producto", verificarToken, function (req, res) {
  // traer todos los productos
  // populate: usuario categoria - que aparezca en al consulta
  // paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// ========================================
// Obtener productosp por ID
// ========================================
app.get("/producto/:id", verificarToken, function (req, res) {
  // populate: usuario categoria - que aparezca en al consulta
  // paginado
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// ========================================
// Buscar productos
// ========================================
app.get("/producto/buscar/:termino", verificarToken, function (req, res) {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// ========================================
// Crear un nuevo productos
// ========================================
app.post("/producto", verificarToken, function (req, res) {
  // grabar el usuario
  // garabar una categoria del listado que ya tenemos
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponibe: body.disponibe,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      productoDB,
    });
  });
});

// ========================================
// Actualizar producto
// ========================================
app.put("/producto/:id", verificarToken, function (req, res) {
  // grabar el usuario
  // garabar una categoria del listado que ya tenemos
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponibe = body.disponibe;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

// ========================================
// Borrar un producto
// ========================================
app.delete("/producto/:id", verificarToken, function (req, res) {
  // el campo "disponible" pase a falso
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        mensaje: "Producto borrado",
      });
    });
  });
});

module.exports = app;
