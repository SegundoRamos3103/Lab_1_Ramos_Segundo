const Carrito = require('../modelos/Carrito');

const agregarProducto = async (req, res) => {
    const { productoId, cantidad = 1 } = req.body;
    const usuarioId = req.usuario.id;

    if (!productoId || cantidad < 1) {
        return res.status(400).json({ mensaje: 'Producto o cantidad inválida' });
    }

    try {
        const resultado = await Carrito.agregarProducto(usuarioId, productoId, cantidad);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const actualizarCantidad = async (req, res) => {
    const { productoId, cantidad } = req.body;
    const usuarioId = req.usuario.id;

    if (!productoId || cantidad < 1) {
        return res.status(400).json({ mensaje: 'Producto o cantidad inválida' });
    }

    try {
        const actualizado = await Carrito.actualizarCantidad(usuarioId, productoId, cantidad);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
        }
        res.json({ mensaje: 'Cantidad actualizada' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    const { productoId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const eliminado = await Carrito.eliminarProducto(usuarioId, productoId);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
        }
        res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
};

const obtenerCarrito = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const carrito = await Carrito.obtenerCarrito(usuarioId);
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el carrito', error: error.message });
    }
};

module.exports = { agregarProducto, actualizarCantidad, eliminarProducto, obtenerCarrito };