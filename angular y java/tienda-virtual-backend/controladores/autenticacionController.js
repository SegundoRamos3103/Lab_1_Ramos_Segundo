const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');

const registrar = async (req, res) => {
    const { nombre, correo, contrasena, direccion, rol } = req.body;
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuarioId = await Usuario.crear({ nombre, correo, contrasena: contrasenaHash, direccion, rol });
        res.status(201).json({ mensaje: 'Usuario registrado', usuarioId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
    }
};

const iniciarSesion = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const usuario = await Usuario.buscarPorCorreo(correo);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        if (usuario.bloqueado) return res.status(403).json({ mensaje: 'Cuenta bloqueada' });

        const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esContrasenaValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports = { registrar, iniciarSesion };