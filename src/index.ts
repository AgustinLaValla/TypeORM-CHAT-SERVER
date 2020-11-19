import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as http from 'http';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import messageRoutes from './routes/message.routes';
import roomRoutes from './routes/rooms.routes'
import { Server } from "socket.io";
import { privateChat } from './socket/private-chat';

const PORT = process.env.PORT || 4000;

createConnection().then(async () => {

    // create express app
    const app = express();
    //Create http server
    const server = http.createServer(app);
    const io: Server = require('socket.io')(server, {
        cors: {
            origin: '*', 
            methods: '*'
        }
    });


    //Middleware
    app.use(cors());
    app.use(helmet());
    app.use(express.json());


    //Routes
    app.get('/', async (req, res) => res.send('Hello world'))
    app.use('/user', userRoutes);
    app.use('/auth', authRoutes);
    app.use('/messages', messageRoutes);
    app.use('/rooms', roomRoutes);

    //Socket
    privateChat(io);

    // start express server
    server.listen(PORT, () => console.log(`Server on port: ${PORT}`));


}).catch(error => console.log(error));
