const express = require('express');
const { registrar, iniciarSesion } = require('../controladores/autenticacionController');

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);

module.exports = router;