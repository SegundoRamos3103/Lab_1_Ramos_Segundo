const Pedido = require('../modelos/Pedido');
const Carrito = require('../modelos/Carrito');

const crearPedido = async (req, res) => {
    const usuarioId = req.usuario.id;
    try {
        const carrito = await Carrito.obtenerCarrito(usuarioId);
        if (!carrito.length) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }
        const pedidoId = await Pedido.crear(usuarioId, carrito);
        res.status(201).json({ mensaje: 'Pedido creado', pedidoId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message });
    }
};

const obtenerHistorial = async (req, res) => {
    const usuarioId = req.usuario.id;
    try {
        const historial = await Pedido.obtenerHistorial(usuarioId);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

const cancelarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const usuarioId = req.usuario.id;
    try {
        await Pedido.cancelar(pedidoId, usuarioId);
        res.json({ mensaje: 'Pedido cancelado' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const obtenerTodosPedidos = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    try {
        const pedidos = await Pedido.obtenerTodos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
};

const actualizarEstado = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { pedidoId } = req.params;
    const { estado, transportista, numeroSeguimiento } = req.body;
    if (!['Pendiente', 'Enviado', 'Entregado', 'Cancelado'].includes(estado)) {
        return res.status(400).json({ mensaje: 'Estado inválido' });
    }
    try {
        await Pedido.actualizarEstado(pedidoId, estado, transportista, numeroSeguimiento);
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
    }
};

module.exports = { crearPedido, obtenerHistorial, cancelarPedido, obtenerTodosPedidos, actualizarEstado };