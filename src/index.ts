import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from './exceptions';
import { Server } from './server/index';

const server: Server = new Server();
server.startListen();
