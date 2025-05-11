const db = require('../config/db');
const Producto = require('./Producto');
class Carrito {
    static async agregarProducto(usuarioId, productoId, cantidad) {
        const stock = await Producto.obtenerStock(productoId);
        if (stock === null) {
            throw new Error('Producto no encontrado');
        }
        if (stock < cantidad) {
            throw new Error('Stock insuficiente');
        }

        const [existing] = await db.execute(
            'SELECT cantidad FROM carritos WHERE usuario_id = ? AND producto_id = ?',
            [usuarioId, productoId]
        );
        if (existing.length > 0) {
            const nuevaCantidad = existing[0].cantidad + cantidad;
            if (stock < nuevaCantidad) {
                throw new Error('Stock insuficiente para la cantidad solicitada');
            }
            await db.execute(
                'UPDATE carritos SET cantidad = ?, actualizado_en = NOW() WHERE usuario_id = ? AND producto_id = ?',
                [nuevaCantidad, usuarioId, productoId]
            );
            await Producto.actualizarStock(productoId, -cantidad); // Restar stock
            return { mensaje: 'Cantidad actualizada', cantidad: nuevaCantidad };
        } else {
            await db.execute(
                'INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
                [usuarioId, productoId, cantidad]
            );
            await Producto.actualizarStock(productoId, -cantidad); // Restar stock
            return { mensaje: 'Producto agregado' };
        }
    }

    static async actualizarCantidad(usuarioId, productoId, cantidad) {
        const [existing] = await db.execute(
            'SELECT cantidad FROM carritos WHERE usuario_id = ? AND producto_id = ?',
            [usuarioId, productoId]
        );
        if (existing.length === 0) {
            throw new Error('Producto no encontrado en el carrito');
        }

        const stockActual = await Producto.obtenerStock(productoId);
        const cantidadActual = existing[0].cantidad;
        const diferencia = cantidad - cantidadActual;

        if (diferencia > 0 && stockActual < diferencia) {
            throw new Error('Stock insuficiente para aumentar la cantidad');
        }

        await db.execute(
            'UPDATE carritos SET cantidad = ?, actualizado_en = NOW() WHERE usuario_id = ? AND producto_id = ?',
            [cantidad, usuarioId, productoId]
        );
        await Producto.actualizarStock(productoId, -diferencia); // Restar o sumar según la diferencia
        return true;
    }

    static async eliminarProducto(usuarioId, productoId) {
        const [existing] = await db.execute(
            'SELECT cantidad FROM carritos WHERE usuario_id = ? AND producto_id = ?',
            [usuarioId, productoId]
        );
        if (existing.length === 0) {
            return false;
        }

        const cantidad = existing[0].cantidad;
        const [resultado] = await db.execute(
            'DELETE FROM carritos WHERE usuario_id = ? AND producto_id = ?',
            [usuarioId, productoId]
        );
        if (resultado.affectedRows > 0) {
            await Producto.actualizarStock(productoId, cantidad); // Devolver stock al eliminar
        }
        return resultado.affectedRows > 0;
    }

    static async obtenerCarrito(usuarioId) {
        const [filas] = await db.execute(
            `SELECT c.producto_id, c.cantidad, p.nombre, p.descripcion, p.precio, p.imagenes, p.stock, cat.nombre AS categoria
             FROM carritos c
             JOIN productos p ON c.producto_id = p.id
             JOIN categorias cat ON p.categoria_id = cat.id
             WHERE c.usuario_id = ?`,
            [usuarioId]
        );
        return filas;
    }

    // Limpiar el carrito (opcional, si necesitas vaciarlo completamente)
    static async limpiarCarrito(usuarioId) {
        await db.execute('DELETE FROM carritos WHERE usuario_id = ?', [usuarioId]);
    }
}

module.exports = Carrito;