import { Router } from 'express';

import fornecimentoController from '../../controllers/compras/fornecimentoController';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, fornecimentoController.index); // listando todas
router.post('/', loginRequired, fornecimentoController.store); // criando
router.put('/:id', loginRequired, fornecimentoController.update);// editando
router.get('/:id', loginRequired, fornecimentoController.show);// listando especifico
router.delete('/:id', loginRequired, fornecimentoController.delete); // deletando

export default router;
