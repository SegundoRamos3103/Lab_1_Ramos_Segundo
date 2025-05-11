const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet'); // Nuevo: para mejorar la seguridad
const autenticacionRoutes = require('./rutas/autenticacionRoutes');
const usuarioRoutes = require('./rutas/usuarioRoutes');
const productoRoutes = require('./rutas/productoRoutes');
const carritoRoutes = require('./rutas/carritoRoutes');
const pedidoRoutes = require('./rutas/pedidoRoutes');
const adminRoutes = require('./rutas/adminRoutes');
require('dotenv').config();

const app = express();

// Deshabilitar el encabezado x-powered-by
app.disable('x-powered-by'); // Solución simple para eliminar x-powered-by

// Alternativa: Usar helmet para deshabilitar x-powered-by y añadir otras cabeceras de seguridad
app.use(helmet.hidePoweredBy()); // Opcional, si decides usar helmet completo
app.use(helmet()); // Opcional: Añade otras cabeceras de seguridad como Content-Security-Policy, X-Frame-Options, etc.

// Lista blanca de orígenes confiables para CORS
const allowedOrigins = [
  'http://localhost:4200', // Para desarrollo
];

// Configuración de CORS con validación dinámica
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como herramientas locales o Postman)
    if (!origin) return callback(null, true);
    
    // Verificar si el origen está en la lista blanca
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Rutas
app.use('/api/auth', autenticacionRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;