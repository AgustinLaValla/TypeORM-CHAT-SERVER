import { Router } from 'express';
import { MessageController } from '../controller/MessageController';
import { chechToken } from '../middlewares/jwt';

const router = Router();

router.get('/:roomId', [chechToken], MessageController.getConversation);

router.post('/', [chechToken], MessageController.sendMessage);


export default router;