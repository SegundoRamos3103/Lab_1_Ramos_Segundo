const express = require('express');
const autenticacionMiddleware = require('../middleware/autenticacionMiddleware');
const { actualizarUsuario, actualizarContrasena, obtenerUsuario } = require('../controladores/usuarioController');

const router = express.Router();

router.put('/actualizar', autenticacionMiddleware, actualizarUsuario);
router.put('/actualizar-contrasena', autenticacionMiddleware, actualizarContrasena);
router.get('/perfil', autenticacionMiddleware, obtenerUsuario); // Nueva ruta

module.exports = router;