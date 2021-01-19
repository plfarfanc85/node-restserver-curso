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
// Base de datos
// ========================================
let urlDB;

//if (process.env.NODE_ENV === "dev") {
//  urlDB = "mongodb://127.0.0.1:27017/cafe";
//} else {
urlDB =
  "mongodb+srv://cafe-user:r44FWP0Q4cNilDgE@cluster0.j4xjz.mongodb.net/cafe?retryWrites=true&w=majority";
//}
process.env.URLDB = urlDB;
