"use client"

import { useUser } from '@/hooks/use-user';
import { useSocket } from '@/hooks/useSocket';
import {createContext, useContext} from 'react';
import React from 'react'

export const SocketContext = createContext({
    socket: null as WebSocket | null,
    sendMessage: (message: string) => {},
    id: null as string | null,
    name: null as string | null,
    setName: (name: string) => {}
});

export default function SocketContextProvider({ children }:{children: React.ReactNode}) {
    const { socket, sendMessage } = useSocket();
    const {id, name, setName} = useUser()
  return (
    <SocketContext.Provider value={{ socket, sendMessage, id, name, setName  }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext);
