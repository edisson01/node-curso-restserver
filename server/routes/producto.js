const express = require('express');

const Producto = require('../models/producto');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

// ==================================
// Obtener todos los productos
// ==================================
app.get('/productos', verificaToken, (req, res) => {

    // Parametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos: productosDB
                });
            });

        });

});

// ==================================
// Obtener un producto por ID
// ==================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID es incorrecto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});


// ==================================
// Buscar productos
// ==================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });

        });
});







// ==================================
// Crear un nuevo producto
// ==================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // 201 - Tambien se utiliza al creeaar un nuevo registro
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});


// ==================================
// Actualizar un producto por ID
// ==================================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let productoActualiza = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion
    };

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                producto: productoGuardado
            });
        });


    });
});


// ==================================
// Borrar un producto por ID
// ==================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Para borrar el producto, se actualiza el campo disponible
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });
        });


    });

});



module.exports = app;