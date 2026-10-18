const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // En producción podés restringirlo a tu dominio
    methods: ["GET", "POST"]
  }
});

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.json({ status: "API Cuatro Tres Cinco funcionando correctamente" });
});

// Gestión de conexiones en tiempo real con WebSockets
io.on('connection', (socket) => {
  console.log(`Nuevo dispositivo conectado: ${socket.id}`);

  // Escuchar cuando entra un nuevo pedido desde la tienda web o kiosko
  socket.on('nuevo-pedido-web', (pedido) => {
    console.log("Pedido recibido:", pedido);
    // Reenviar el pedido al tablero activo de la pizzería en tiempo real
    io.emit('actualizar-tablero', pedido);
  });

  // Cambio de estado de un pedido (ej: de Aceptado a Preparando)
  socket.on('cambiar-estado-pedido', (data) => {
    io.emit('estado-actualizado', data);
  });

  socket.on('disconnect', () => {
    console.log(`Dispositivo desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});