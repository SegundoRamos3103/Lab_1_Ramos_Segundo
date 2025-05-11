const db = require('../config/db');

class Usuario {
    static async crear({ nombre, correo, contrasena, direccion, rol }) {
        const [resultado] = await db.execute(
            'INSERT INTO usuarios (nombre, correo, contrasena, direccion, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, correo, contrasena, direccion, rol]
        );
        return resultado.insertId;
    }

    static async buscarPorCorreo(correo) {
        const [filas] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return filas[0];
    }

    static async buscarPorId(id) {
        const [filas] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return filas[0];
    }

    static async actualizar(id, { nombre, correo, direccion }) {
        await db.execute(
            'UPDATE usuarios SET nombre = ?, correo = ?, direccion = ? WHERE id = ?',
            [nombre, correo, direccion, id]
        );
    }

    static async actualizarContrasena(id, contrasena) {
        await db.execute(
            'UPDATE usuarios SET contrasena = ? WHERE id = ?',
            [contrasena, id]
        );
    }

    // Nuevo: Bloquear o desbloquear usuario
    static async bloquear(id, bloquear) {
        await db.execute('UPDATE usuarios SET bloqueado = ? WHERE id = ?', [bloquear, id]);
    }

    // Nuevo: Eliminar usuario
    static async eliminar(id) {
        const [resultado] = await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    }

    // Nuevo: Listar todos los usuarios
    static async listar() {
        const [filas] = await db.execute('SELECT id, nombre, correo, direccion, rol, bloqueado FROM usuarios ORDER BY nombre ASC');
        return filas;
    }
}

module.exports = Usuario;