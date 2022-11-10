import { ChangeEvent, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { io, Socket } from 'socket.io-client'

type Chat = {
  name: string,
  message: string,
  timestamp: Date
}

type Conversation = {
  conversations: Chat[]
}

//initialize connection
const socket: Socket = io('ws://localhost:3000', {
  transports: ['websocket', 'polling']
})



function App() {

  const [toggleCon, setToggleCon] = useState(true)

  const [chat, setChat] = useState<Chat>({
    name: socket.id,
    message: '',
    timestamp: new Date(Date.now())
  })

  const [conversation, setConversation] = useState<Chat[]>([])
  const [group, setGroup] = useState<Chat[]>([])


  socket.on('chat-message', (message, id) => {
    console.log(`[client] ${id}: ${message}`);
    setConversation([
      ...conversation, {
        name: id,
        message,
        timestamp: new Date(Date.now())
      }
    ])
  })
  socket.on('group-message', (message, id) => {
    console.log(`[client-group] ${id}: ${message}`);
    setGroup([
      ...group, {
        name: id,
        message,
        timestamp: new Date(Date.now())
      }
    ])
  })




  socket.on('connect_error', () => {
    socket.io.opts.transports = ['polling', 'websocket']
  })


  socket.on('connect', () => {
    console.log('socket.io client connected')
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChat({ ...chat, message: event.target.value })
  }

  const handleSendMessage = (event: React.MouseEvent) => {
    event.preventDefault()
    socket.emit('chat', chat.message)

    setChat({ ...chat, message: '' })
  }
  const handleGroupMessage = (event: React.MouseEvent) => {
    event.preventDefault()

    socket.emit('group', chat.message)
    setChat({ ...chat, message: '' })

  }


  const handleConnection = () => {
    setToggleCon(prev => !prev)
    if (toggleCon) socket.connect();
    else socket.disconnect();
  }

  return (
    <div className="App">
      <div>
        <div>
          {conversation.map((convo, index) => (
            <div key={index}>

              <span>{convo.name}:{convo.message}</span>
            </div>
          ))}
        </div>
        <div>

          <input type="text" onChange={handleChange} value={chat.message} />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleGroupMessage}>Group</button>
        </div>

        <button onClick={handleConnection}>{toggleCon ? 'Disconnect' : 'Reconnect'}</button>
        <div>
          {group.map((convo, index) => (
            <div key={index}>

              <span>{convo.name}:{convo.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
