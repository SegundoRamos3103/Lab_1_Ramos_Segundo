const db = require('../config/db'); // Importar la conexión a la base de datos
const Pedido = require('../modelos/Pedido');
const Producto = require('../modelos/Producto');
const Usuario = require('../modelos/Usuario');
const Categoria = require('../modelos/Categoria');

const obtenerEstadisticas = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    try {
        const [ventas] = await db.execute('SELECT SUM(total) AS total_ventas FROM pedidos WHERE estado = "Entregado"');
        const totalVentas = ventas[0].total_ventas || 0;
        const productosMasVendidos = await Producto.productosMasVendidos();
        const [usuarios] = await db.execute('SELECT COUNT(*) AS total_usuarios FROM usuarios');
        const totalUsuarios = usuarios[0].total_usuarios;

        res.json({
            totalVentas,
            productosMasVendidos,
            totalUsuarios,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
    }
};

const listarUsuarios = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    try {
        const usuarios = await Usuario.listar();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
    }
};

const bloquearUsuario = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { usuarioId } = req.params;
    const { bloquear } = req.body;
    try {
        await Usuario.bloquear(usuarioId, bloquear);
        res.json({ mensaje: `Usuario ${bloquear ? 'bloqueado' : 'desbloqueado'} exitosamente` });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al bloquear usuario', error: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { usuarioId } = req.params;
    try {
        const eliminado = await Usuario.eliminar(usuarioId);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
    }
};

const crearCategoria = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { nombre, descripcion } = req.body;
    try {
        const categoriaId = await Categoria.crear({ nombre, descripcion });
        res.status(201).json({ mensaje: 'Categoría creada', categoriaId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear categoría', error: error.message });
    }
};

const actualizarCategoria = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { categoriaId } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        await Categoria.actualizar(categoriaId, { nombre, descripcion });
        res.json({ mensaje: 'Categoría actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
    }
};

const eliminarCategoria = async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No autorizado' });
    }
    const { categoriaId } = req.params;
    try {
        const eliminado = await Categoria.eliminar(categoriaId);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
    }
};

const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.listar();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar categorías', error: error.message });
    }
};

module.exports = {
    obtenerEstadisticas,
    listarUsuarios,
    bloquearUsuario,
    eliminarUsuario,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    listarCategorias,
};