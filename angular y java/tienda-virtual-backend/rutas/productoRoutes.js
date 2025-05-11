const express = require('express');
const autenticacionMiddleware = require('../middleware/autenticacionMiddleware');
const { crearProducto, actualizarProducto, eliminarProducto, listarProductos, buscarProductos, obtenerProductoPorId  } = require('../controladores/productoController');

const router = express.Router();

router.post('/', autenticacionMiddleware, crearProducto);
router.put('/:id', autenticacionMiddleware, actualizarProducto);
router.delete('/:id', autenticacionMiddleware, eliminarProducto);
router.get('/', listarProductos);
router.get('/buscar', buscarProductos);
router.get('/:id', obtenerProductoPorId);

module.exports = router;