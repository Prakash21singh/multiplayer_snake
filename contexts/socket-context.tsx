"use client"

import { useSocket } from '@/hooks/useSocket';
import {createContext, useContext} from 'react';
import React from 'react'

export const SocketContext = createContext({
    socket: null as WebSocket | null,
    sendMessage: (message: string) => {},
});

export default function SocketContextProvider({ children }:{children: React.ReactNode}) {
    const { socket, sendMessage } = useSocket();
    
  return (
    <SocketContext.Provider value={{ socket, sendMessage  }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext);
