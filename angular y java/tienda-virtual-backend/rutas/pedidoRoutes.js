const express = require('express');
const autenticacionMiddleware = require('../middleware/autenticacionMiddleware');
const { crearPedido, obtenerHistorial, cancelarPedido, obtenerTodosPedidos, actualizarEstado } = require('../controladores/pedidoController');

const router = express.Router();

router.post('/crear', autenticacionMiddleware, crearPedido);
router.get('/historial', autenticacionMiddleware, obtenerHistorial);
router.put('/cancelar/:pedidoId', autenticacionMiddleware, cancelarPedido);
router.get('/todos', autenticacionMiddleware, obtenerTodosPedidos);
router.put('/actualizar/:pedidoId', autenticacionMiddleware, actualizarEstado);

module.exports = router;