// =======================================
// PUERTO
// =======================================
process.env.PORT = process.env.PORT || 3000;


// =======================================
// ENTORNO
// =======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =======================================
// Vencimiento del Token
// =======================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
// 60 * 60 * 24 * 30 = 1 mes
process.env.CADUCIDAD_TOKEN = '48h';

// =======================================
// SEED de autenticación
// =======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =======================================
// BASE DE DATOS
// =======================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;



// =======================================
// Google Client ID
// =======================================
// Pendiente configurar el CLIENT_IDen Heroku, en caso de que cambie...
process.env.CLIENT_ID = process.env.CLIENT_ID || '164952571542-jj7qg521f7jf94irdjnrgvmdjsa3csml.apps.googleusercontent.com';