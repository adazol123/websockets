const { Server } = require('ws');

const wss = new Server({ port: 3000 })

let messages = [];

wss.on('connection', socket => {
    console.time('socket');

    socket.on('message', message => {
        console.info(messsage)
        messages.push(message)
        wss.clients.forEach(client => client.send(message))
    })


    socket.on('close', () => {
        console.info('socket disconnected')
    })

    socket.send('welcome to cyber chat')

    if (messages.length) {
        socket.send('chat currently in session')
        messages.forEach(message => socket.send(message))
    }

    console.info('new socket connected')
    console.timeEnd('socket')
})

console.info('chat server waiting for connection on ws://localhost:3000')