const Producto = require('../modelos/Producto');

const crearProducto = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { nombre, descripcion, precio, imagenes, stock, categoria_id } = req.body;
    try {
        const productoId = await Producto.crear({ nombre, descripcion, precio, imagenes, stock, categoria_id });
        res.status(201).json({ mensaje: 'Producto creado', productoId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
    }
};

const actualizarProducto = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { id } = req.params;
    const { nombre, descripcion, precio, imagenes, stock, categoria } = req.body;
    try {
        await Producto.actualizar(id, { nombre, descripcion, precio, imagenes, stock, categoria });
        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    if (req.usuario.rol !== 'admin') { // Usamos "admin" como mencionaste
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { id } = req.params;
    try {
        const filasAfectadas = await Producto.eliminar(id);
        if (filasAfectadas == 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
};

const listarProductos = async (req, res) => {
    const { pagina, limite } = req.query;
    try {
        const productos = await Producto.listar({ pagina, limite });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
    }
};

const buscarProductos = async (req, res) => {
    const { categoria, precioMin, precioMax, nombre, ordenarPor, orden } = req.query;
    try {
        const productos = await Producto.buscar({ categoria, precioMin, precioMax, nombre, ordenarPor, orden });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar productos', error: error.message });
    }
};

const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.obtenerPorId(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
    }
};

module.exports = { crearProducto, actualizarProducto, eliminarProducto, listarProductos, buscarProductos, obtenerProductoPorId };