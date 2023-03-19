import { Router } from 'express';

import compraController from '../../controllers/compras/compraController';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, compraController.index); // listando todas
router.post('/', loginRequired, compraController.store); // criando
router.put('/:id', loginRequired, compraController.update);// editando
router.get('/:id', loginRequired, compraController.show);// listando especifico
router.delete('/:id', loginRequired, compraController.delete); // deletando

export default router;
