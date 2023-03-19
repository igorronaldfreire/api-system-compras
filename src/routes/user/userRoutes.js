import { Router } from 'express';
import UserController from '../../controllers/user/UserController';

import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, UserController.index);
router.post('/', loginRequired, UserController.store);
router.put('/:id', loginRequired, UserController.update);
router.get('/:id', loginRequired, UserController.show);
router.delete('/:id', loginRequired, UserController.delete);

export default router;
