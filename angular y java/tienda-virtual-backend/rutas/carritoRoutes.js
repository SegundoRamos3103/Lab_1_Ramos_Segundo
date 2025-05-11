const express = require('express');
const autenticacionMiddleware = require('../middleware/autenticacionMiddleware');
const { agregarProducto, actualizarCantidad, eliminarProducto, obtenerCarrito } = require('../controladores/carritoController');

const router = express.Router();

// Rutas protegidas por autenticación
router.post('/agregar', autenticacionMiddleware, agregarProducto);
router.put('/actualizar', autenticacionMiddleware, actualizarCantidad);
router.delete('/eliminar/:productoId', autenticacionMiddleware, eliminarProducto);
router.get('/', autenticacionMiddleware, obtenerCarrito);

module.exports = router;