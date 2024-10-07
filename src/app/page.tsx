"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Page() {
  const socket = io("http://localhost:8000")
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [inputMsg, setInputMsg] = useState("ok")
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents(previous => [...previous, value]);
    }

    function onMessage(msg: []) {
      fooEvents.push(msg)
      setFooEvents([...fooEvents])
      console.log(msg)
    }

    socket.on("message", onMessage)
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('message', onMessage)
    };
  })

  const onSubmit = (e: any) => {
    e.preventDefault()
    socket.emit("message", { text: inputMsg, socketID: socket.id })
  }
  return (
    <div>
      <ul>
        <li></li>
        {fooEvents && fooEvents.map(item => (
          <p>{item.text}</p>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="send your message" onChange={(e) => setInputMsg(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  )
}