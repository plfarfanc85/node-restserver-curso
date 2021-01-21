require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// Cuando veamos app.use son Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// configuracion global de rutas
app.use(require("./routes/index"));

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

let conectarBD = async () => {
  await mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  return "Bases de datos ONLINE";
};

conectarBD()
  .then((mensaje) => console.log(mensaje))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto: ", process.env.PORT);
});
