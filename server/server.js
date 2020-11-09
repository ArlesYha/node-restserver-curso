require("./config/config")

const express = require("express")
const mongoose = require('mongoose')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//CONFIGURACION GLOBAL DE RUTAS
app.use(require("./routes/index"))

// mongoose.connect('mongodb://localhost:27017/cafe', {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }, (err, resp) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Base de Datos ONLINE');
// });

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, resp) => {
    if (err) {
        throw err;
    }
    console.log('Base de Datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
})