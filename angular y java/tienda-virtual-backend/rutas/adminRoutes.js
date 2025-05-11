const express = require('express');
const autenticacionMiddleware = require('../middleware/autenticacionMiddleware');
const {
    obtenerEstadisticas,
    listarUsuarios,
    bloquearUsuario,
    eliminarUsuario,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    listarCategorias,
} = require('../controladores/adminController');

const router = express.Router();

// Rutas protegidas para administradores
router.get('/estadisticas', autenticacionMiddleware, obtenerEstadisticas);
router.get('/usuarios', autenticacionMiddleware, listarUsuarios);
router.put('/usuarios/bloquear/:usuarioId', autenticacionMiddleware, bloquearUsuario);
router.delete('/usuarios/eliminar/:usuarioId', autenticacionMiddleware, eliminarUsuario);
router.post('/categorias/crear', autenticacionMiddleware, crearCategoria);
router.put('/categorias/actualizar/:categoriaId', autenticacionMiddleware, actualizarCategoria);
router.delete('/categorias/eliminar/:categoriaId', autenticacionMiddleware, eliminarCategoria);

// Ruta pública
router.get('/categorias', listarCategorias);

module.exports = router;