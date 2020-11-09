const express = require('express')

//LIBRERIA PARA ENCRIPTAR
const bcrypt = require("bcrypt")
const _ = require("underscore")

const Usuario = require("../models/usuario")
const {verificaToken, verificaAdmin_Role} = require("../middlewares/autenticacion")


const app = express()

app.get('/usuario', verificaToken, function (req, res) {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    // Usuario.find({estado: true})
    //         // .skip(desde)
    //         // .limit(limite)
    //         .exec((err, usuarios) => {
    //             if(err) {
    //                 return res.status(400).json({
    //                     ok: false,
    //                     err
    //                 })
    //             }

    //             Usuario.count({estado: true}, (err, cont) => {
    //                 res.json({
    //                     ok: true,
    //                     usuarios,
    //                     cuantos: cont
    //                 })
    //             })
    //         })

    // Usuario.find({})
    //         .skip(desde)
    //         .limit(limite)
    //         .exec((err, usuarios) => {
    //             if(err) {
    //                 return res.status(400).json({
    //                     ok: false,
    //                     err
    //                 })
    //             }

    //             Usuario.count({}, (err, cont) => {
    //                 res.json({
    //                     ok: true,
    //                     usuarios,
    //                     cuantos: cont
    //                 })
    //             })
    //         })

    // GET exclusivo: Con esta forma puedes llamar ciertos campos en específico
    Usuario.find({}, "nombre email role estado google img")
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.count({}, (err, cont) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: cont
                    })
                })
            })

    // res.json('get Usuario')
})

app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    // if(body.nombre === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario"
    //     })
    // } else {
    //     res.json({
    //         persona: body
    //     })
    // }
})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"])

    // delete body.password
    // delete body.google

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

    let id = req.params.id

    let cambiaEstado = {
        estado: false
    }
    
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
    // res.json('delete Usuario')
})

module.exports = app