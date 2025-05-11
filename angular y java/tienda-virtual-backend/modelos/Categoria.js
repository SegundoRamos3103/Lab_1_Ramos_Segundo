const db = require('../config/db');

class Categoria {
    static async crear({ nombre, descripcion }) {
        const [resultado] = await db.execute(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, descripcion }) {
        await db.execute(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion || null, id]
        );
    }

    static async eliminar(id) {
        const [resultado] = await db.execute('DELETE FROM categorias WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    }

    static async listar() {
        const [filas] = await db.execute('SELECT * FROM categorias ORDER BY nombre ASC');
        return filas;
    }

    static async buscarPorId(id) {
        const [filas] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);
        return filas[0];
    }
}

module.exports = Categoria;