const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcryptjs');

const actualizarUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { nombre, correo, direccion } = req.body;
    try {
        await Usuario.actualizar(id, { nombre, correo, direccion });
        res.json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error });
    }
};

const actualizarContrasena = async (req, res) => {
    const { id } = req.usuario;
    const { contrasena } = req.body;
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        await Usuario.actualizarContrasena(id, contrasenaHash);
        res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ mensaje: 'Error al actualizar contraseña', error: error.message });
    }
};

// Nuevo método para obtener la información del usuario
const obtenerUsuario = async (req, res) => {
    const { id } = req.usuario; // Obtenido del token JWT
    try {
        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        // No devolvemos la contraseña por seguridad
        const { contrasena, ...datosUsuario } = usuario;
        res.json(datosUsuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
    }
};

module.exports = { actualizarUsuario, actualizarContrasena, obtenerUsuario };