const jwt = require('jsonwebtoken');

const autenticacionMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Usar encadenamiento opcional para verificar si authHeader existe y comienza con 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token válido' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decodificado; // Almacena el payload decodificado en req.usuario
        next();
    } catch (error) {
        // Diferenciar entre tipos de errores JWT para mejor depuración
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ mensaje: 'El token ha expirado' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        } else {
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
};

module.exports = autenticacionMiddleware;