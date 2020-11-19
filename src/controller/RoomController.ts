import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { throwInternalServerError } from '../utils/utils';

export class RoomController {
    static createRoom = async (req: Request, res: Response): Promise<Response> => {

        const { name } = req.body
        const { userId } = res.locals.user;

        try {

            const roomRepository = await getRepository(Room);

            const exists = await roomRepository.findOne({ where: { name } });
            if (exists) return res.status(400).json({ ok: false, message: 'Room Name Already exists' });

            const owner = await getRepository(User).findOne(userId);

            const room = await getRepository(Room).create({ name, owner });

            const errors = await validate(room);
            if (errors.length) return res.status(400).json({ ok: false, errors });

            //Set owner as memeber of the room
            await getRepository(Room)
                .createQueryBuilder()
                .relation(Room, "users")
                .of(room)
                .add(owner);

            await getRepository(Room).save(room);

            return res.json({ ok: true, message: 'Room Successfully created', room });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal Server Error' });
        }
    }

    static getRooms = async (req: Request, res: Response) => {
        try {
            const rooms = await getRepository(Room)
                .createQueryBuilder('room')
                .leftJoinAndSelect('room.users', 'user')
                .getMany();
            return res.json({ ok: true, rooms });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal Server Error' });
        }
    };

    static enterRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { id } = res.locals.user;

        try {

            await getRepository(Room)
                .createQueryBuilder()
                .relation(Room, "users")
                .of(roomId)
                .add(id);

            return res.json({ ok: true, message: 'You have entered to the room' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(error);
                return res.status(422).json({ ok: false, message: 'User is already subscribed to the room' });
            }
            return throwInternalServerError(res, error);
        }
    };

    static leaveRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { id } = res.locals.user;

        try {
            await getRepository(Room)
                .createQueryBuilder()
                .relation(Room, 'users')
                .of(roomId)
                .remove(id)

            return res.json({ ok: true, message: 'you have left the room' });
        } catch (error) {
            console.log(error);
            return throwInternalServerError(res, error);
        }
    };
}