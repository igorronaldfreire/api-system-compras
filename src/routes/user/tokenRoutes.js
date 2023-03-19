import { Router } from 'express';

import TokenController from '../../controllers/user/TokenController';

const router = new Router();

router.post('/', TokenController.store);

export default router;
