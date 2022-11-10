const { createServer } = require('http')
const socketIO = require('socket.io')

const server = createServer().listen(3000);
const io = socketIO(server);


io.on('connection', socket => {
    console.info(`${io.engine.clientsCount} connections \n New Client: ${socket.id}`);

    // event emitter
    socket.on('chat', message => {
        console.info(`chat-${socket.id}: ${message}`)
        io.sockets.emit('chat-message', message, socket.id)
    })
    socket.on('group', message => {
        console.info(`group-${socket.id}: ${message}`)
        io.sockets.emit('group-message', message, socket.id)
    })

    socket.on('disconnect', () => {
        console.info(`current: ${io.engine.clientsCount} connections \n Disconnected Client: ${socket.id}`)
    })
})


console.info('Socket Server running on port 3000')