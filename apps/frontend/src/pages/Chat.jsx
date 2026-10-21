
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5001', {
  autoConnect: false,
})

export default function Chat() {
  const [username, setUsername] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.connect()

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onMessage = (data) => {
      setMessages((previous) => [...previous, data])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chatMessage', onMessage)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('chatMessage', onMessage)
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(event) {
    event.preventDefault()

    if (!username || !message.trim() || !connected) return

    socket.emit('chatMessage', {
      username,
      message: message.trim(),
    })

    setMessage('')
  }

  return (
    <main style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <h1>Carventory Real-Time Chat</h1>

      <p>
        Server status:{' '}
        <strong>{connected ? 'Connected' : 'Disconnected'}</strong>
      </p>

      {!username ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (usernameInput.trim()) {
              setUsername(usernameInput.trim().slice(0, 30))
            }
          }}
        >
          <input
            value={usernameInput}
            onChange={(event) => setUsernameInput(event.target.value)}
            placeholder="Enter your username"
            maxLength={30}
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <>
          <p>Welcome, {username}!</p>

          <section
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 16,
              height: 300,
              overflowY: 'auto',
              marginBottom: 16,
            }}
          >
            {messages.length === 0 && (
              <p>No messages yet. Start the conversation!</p>
            )}

            {messages.map((item, index) => (
              <p key={`${index}-${item.time}`}>
                <strong>{item.username}</strong> ({item.time}):{' '}
                {item.message}
              </p>
            ))}

            <div ref={messagesEndRef} />
          </section>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
              maxLength={500}
              style={{ flex: 1 }}
              required
            />
            <button type="submit" disabled={!connected}>
              Send
            </button>
          </form>
        </>
      )}
    </main>
  )
}
