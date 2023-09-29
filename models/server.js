// ------------------------------------------------
//   ===> Librerias
// ------------------------------------------------
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { createServer } = require('http')

// ------------------------------------------------
//   ===> Configuracion de DB + Sockets
// ------------------------------------------------
const { dbConennction } = require('../database/config');
const { socketController } = require('../sockets/controllers');

// ------------------------------------------------
//   ===>            Inicio  Modulo            <===
// ------------------------------------------------
class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.server = createServer(this.app)
      this.io = require('socket.io')(this.server)

      this.paths = {
         auth: '/api/auth',
         buscar: '/api/buscar',
         categorias: '/api/categorias',
         productos: '/api/productos',
         usuarios: '/api/usuarios',
         uploads: '/api/uploads',
      };

      // Conectar a BD
      this.conectarDB();

      // Middlewares
      this.middlewares();

      // Rutas de mi aplicación
      this.routes();

      // Sockets
      this.sockets();
   }

   async conectarDB() {
      await dbConennction();
   }

   middlewares() {
      // CORS
      this.app.use(cors());

      // Lectura y parseo del body
      this.app.use(express.json());

      // Directorio Público
      this.app.use(express.static('public'));

      // Fileupload - Carga de archivos
      this.app.use(fileUpload({
         useTempFiles: true,
         tempFileDir: '/temp/',
         createParentPath: true,
      }))
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.buscar, require('../routes/buscar'));
      this.app.use(this.paths.categorias, require('../routes/categorias'));
      this.app.use(this.paths.productos, require('../routes/productos'));
      this.app.use(this.paths.usuarios, require('../routes/usuarios'));
      this.app.use(this.paths.uploads, require('../routes/uploads'));
   }

   sockets() {
      this.io.on('connection', (socket) => socketController(socket, this.io))
   }

   listen() {
      this.server.listen(this.port, () => {
         console.log('Servidor corriendo en puerto', this.port);
      });
   }
}

module.exports = Server;
