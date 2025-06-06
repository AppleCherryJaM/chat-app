import { io } from 'socket.io-client';

const IO_URL = import.meta.env.VITE_BE_IO_URL;

export const socket = io(IO_URL);