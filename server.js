const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configura la carpeta pública
app.use(express.static('public'));

// Manejar cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Manejar la creación de una sala
  socket.on('crearSala', (codigoSala) => {
    socket.join(codigoSala); // El cliente se une a la sala
    console.log(`Sala creada con código: ${codigoSala}`);
    io.to(codigoSala).emit('nuevoJugador', `Jugador con ID ${socket.id} ha creado la sala ${codigoSala}`);
  });

  // Manejar unirse a una sala
  socket.on('unirseSala', (codigoSala) => {
    socket.join(codigoSala); // El cliente se une a la sala
    console.log(`Jugador con ID ${socket.id} se unió a la sala ${codigoSala}`);
    io.to(codigoSala).emit('nuevoJugador', `Jugador con ID ${socket.id} se unió a la sala ${codigoSala}`);
  });

  // Manejar la desconexión de un cliente
  socket.on('disconnect', () => {
    console.log('Jugador desconectado');
  });
});

// Establece el puerto y arranca el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
