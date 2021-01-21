// Declarar constante, variables ... de forma global
// Heroku nos actualiza esta variable por nosotros, entonces si no existe lo setiamos al 3000

// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ========================================
// Vencimiento del token
// ========================================
// 30 días de expiración
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================
// SEED de autenticación
// ========================================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ========================================
// Base de datos
// ========================================
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://127.0.0.1:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ========================================
// Google Client ID
// ========================================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "629229067160-83dumi97n6ir3kiq196gnt0hu36c4q68.apps.googleusercontent.com";
