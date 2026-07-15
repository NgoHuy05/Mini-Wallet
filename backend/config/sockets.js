module.exports.sockets = {
  onConnect: function (session, socket) {
    socket.on('join', (data) => {
      if (data && data.room) {
        sails.sockets.join(socket, data.room);
        socket.emit('joined', { room: data.room });
      }
    });
  }
};
