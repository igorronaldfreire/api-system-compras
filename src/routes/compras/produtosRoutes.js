import { Router } from 'express';
import produtoController from '../../controllers/compras/produtoController';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, produtoController.index); // listando todas
router.post('/', loginRequired, produtoController.store); // criando
router.put('/:id', loginRequired, produtoController.update);// editando
router.get('/:id', loginRequired, produtoController.show);// listando especifico
router.delete('/:id', loginRequired, produtoController.delete); // deletando

export default router;
