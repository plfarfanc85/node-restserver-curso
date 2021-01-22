const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

// ========================================
// Verificar Token
// ========================================
let verificarToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Token no valido o no se ha enviado token",
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// ========================================
// Verificar AdminRole
// ========================================
let verificarAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }

  next();
};

module.exports = {
  verificarToken,
  verificarAdmin_Role,
};
