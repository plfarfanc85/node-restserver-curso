// Declarar constante, variables ... de forma global
// Heroku nos actualiza esta variable por nosotros, entonces si no existe lo setiamos al 3000

// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;
