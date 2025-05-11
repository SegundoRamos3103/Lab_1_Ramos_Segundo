const db = require('../config/db');

class Producto {
    static async crear({ nombre, descripcion, precio, imagenes, stock, categoria_id }) {
        const [resultado] = await db.execute(
            'INSERT INTO productos (nombre, descripcion, precio, imagenes, stock, categoria_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, imagenes, stock, categoria_id || null]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, descripcion, precio, imagenes, stock, categoria_id }) {
        await db.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagenes = ?, stock = ?, categoria_id = ? WHERE id = ?',
            [nombre, descripcion, precio, imagenes, stock, categoria_id || null, id]
        );
    }

    static async eliminar(id) {
        await db.execute('DELETE FROM productos WHERE id = ?', [id]);
    }

    static async listar({ pagina = 1, limite = 10 }) {
        const offset = (pagina - 1) * limite;
        const [filas] = await db.execute(
            'SELECT p.*, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LIMIT ? OFFSET ?',
            [limite, offset].map(String)
        );
        return filas;
    }

    static async buscar({ categoria_id, precioMin, precioMax, nombre, ordenarPor = 'precio', orden = 'ASC' }) {
        let query = 'SELECT p.*, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE 1=1';
        const params = [];
        if (categoria_id) { query += ' AND p.categoria_id = ?'; params.push(categoria_id); }
        if (precioMin) { query += ' AND p.precio >= ?'; params.push(precioMin); }
        if (precioMax) { query += ' AND p.precio <= ?'; params.push(precioMax); }
        if (nombre) { query += ' AND p.nombre LIKE ?'; params.push(`%${nombre}%`); }
        query += ` ORDER BY ${ordenarPor} ${orden}`;
        const [filas] = await db.execute(query, params);
        return filas;
    }

    static async obtenerStock(productoId) {
        const [filas] = await db.execute('SELECT stock FROM productos WHERE id = ?', [productoId]);
        return filas[0] ? filas[0].stock : null;
    }

    static async actualizarStock(productoId, cantidad) {
        await db.execute('UPDATE productos SET stock = stock + ? WHERE id = ?', [cantidad, productoId]);
    }

    // Nuevo: Productos más vendidos
    static async productosMasVendidos(limite = 5) {
        const [filas] = await db.execute(
            `SELECT p.id, p.nombre, SUM(dp.cantidad) AS total_vendido
             FROM productos p
             JOIN detalles_pedido dp ON p.id = dp.producto_id
             GROUP BY p.id, p.nombre
             ORDER BY total_vendido DESC
             LIMIT ?`,
            [limite]
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await db.execute(
            'SELECT p.*, c.nombre AS categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?',
            [id]
        );
        return filas[0] || null; // Devuelve el producto o null si no se encuentra
    }
    
}

module.exports = Producto;