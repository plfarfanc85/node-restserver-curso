const express = require("express");
const fileUpload = require("express-fileupload");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");
const app = express();

// default options - middleware
// todos los archivos que se carguen, caen dentro del req.files
// transforma lo que sea de lo que se este subiendo en un objeto llamado files
app.use(fileUpload());

app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningún archivo",
      },
    });
  }

  // Valida tipo
  let tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidas son " + tiposValidos.join(", "),
      },
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // nombre del parametro al momento de hacer la petición
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesValidas.join(", "),
        ext: extension,
      },
    });
  }

  // Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  let uploadPath = `uploads/${tipo}/${nombreArchivo}`;
  //uploadPath = __dirname + "/somewhere/on/your/server/" + archivo.name;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    // Aqui la imagen ya esta guardad
    if (tipo === "usuarios") imagenUsuario(id, res, nombreArchivo);
    else if (tipo === "productos") imagenProducto(id, res, nombreArchivo);
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no exite",
        },
      });
    }

    borrarArchivo(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no exite",
        },
      });
    }

    borrarArchivo(productoDB.img, "productos");

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borrarArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
