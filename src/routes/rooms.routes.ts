import { Router } from 'express';
import { RoomController } from '../controller/RoomController';
import { chechToken } from '../middlewares/jwt';

const router = Router();

router.get('/', RoomController.getRooms);
router.post('/', [chechToken], RoomController.createRoom);
router.put('/:roomId', [chechToken], RoomController.enterRoom);
router.put('/leave/:roomId', [chechToken], RoomController.leaveRoom);

export default router;