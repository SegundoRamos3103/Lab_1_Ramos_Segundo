const db = require('../config/db');
const Producto = require('./Producto');

class Pedido {
    // Crear un pedido a partir del carrito
    static async crear(usuarioId, carrito) {
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const [resultado] = await db.execute(
            'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)',
            [usuarioId, total, 'Pendiente']
        );
        const pedidoId = resultado.insertId;

        // Insertar detalles del pedido
        for (const item of carrito) {
            await db.execute(
                'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [pedidoId, item.producto_id, item.cantidad, item.precio]
            );
        }

        // Limpiar el carrito tras crear el pedido
        await db.execute('DELETE FROM carritos WHERE usuario_id = ?', [usuarioId]);

        return pedidoId;
    }

    // Obtener el historial de pedidos de un usuario
    static async obtenerHistorial(usuarioId) {
        const [pedidos] = await db.execute(
            `SELECT p.id, p.total, p.estado, p.transportista, p.numero_seguimiento, p.creado_en, p.actualizado_en
             FROM pedidos p
             WHERE p.usuario_id = ?
             ORDER BY p.creado_en DESC`,
            [usuarioId]
        );

        for (let pedido of pedidos) {
            const [detalles] = await db.execute(
                `SELECT dp.producto_id, dp.cantidad, dp.precio_unitario, p.nombre
                 FROM detalles_pedido dp
                 JOIN productos p ON dp.producto_id = p.id
                 WHERE dp.pedido_id = ?`,
                [pedido.id]
            );
            pedido.detalles = detalles;
        }

        return pedidos;
    }

    // Cancelar un pedido
    static async cancelar(pedidoId, usuarioId) {
        const [pedido] = await db.execute(
            'SELECT estado FROM pedidos WHERE id = ? AND usuario_id = ?',
            [pedidoId, usuarioId]
        );
        if (!pedido[0]) {
            throw new Error('Pedido no encontrado');
        }
        if (pedido[0].estado !== 'Pendiente') {
            throw new Error('Solo se pueden cancelar pedidos pendientes');
        }

        await db.execute(
            'UPDATE pedidos SET estado = ?, actualizado_en = NOW() WHERE id = ?',
            ['Cancelado', pedidoId]
        );

        // Devolver el stock de los productos cancelados
        const [detalles] = await db.execute(
            'SELECT producto_id, cantidad FROM detalles_pedido WHERE pedido_id = ?',
            [pedidoId]
        );
        for (const item of detalles) {
            await Producto.actualizarStock(item.producto_id, item.cantidad);
        }
    }

    // Obtener todos los pedidos (para administradores)
    static async obtenerTodos() {
        const [pedidos] = await db.execute(
            `SELECT p.id, p.usuario_id, u.nombre AS usuario_nombre, p.total, p.estado, p.transportista, p.numero_seguimiento, p.creado_en, p.actualizado_en
             FROM pedidos p
             JOIN usuarios u ON p.usuario_id = u.id
             ORDER BY p.creado_en DESC`
        );

        for (let pedido of pedidos) {
            const [detalles] = await db.execute(
                `SELECT dp.producto_id, dp.cantidad, dp.precio_unitario, p.nombre
                 FROM detalles_pedido dp
                 JOIN productos p ON dp.producto_id = p.id
                 WHERE dp.pedido_id = ?`,
                [pedido.id]
            );
            pedido.detalles = detalles;
        }

        return pedidos;
    }

    // Actualizar el estado de un pedido (para administradores)
    static async actualizarEstado(pedidoId, estado, transportista, numeroSeguimiento) {
        await db.execute(
            'UPDATE pedidos SET estado = ?, transportista = ?, numero_seguimiento = ?, actualizado_en = NOW() WHERE id = ?',
            [estado, transportista || null, numeroSeguimiento || null, pedidoId]
        );
    }
}

module.exports = Pedido;