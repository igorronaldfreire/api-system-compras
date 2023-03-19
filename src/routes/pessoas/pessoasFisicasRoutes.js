import { Router } from 'express';
import pessoaFisicaController from '../../controllers/pessoas/PessoaFisicaController';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, pessoaFisicaController.index); // listando todas
router.post('/', loginRequired, pessoaFisicaController.store); // criando
router.put('/:id', loginRequired, pessoaFisicaController.update);// editando
router.get('/:id', loginRequired, pessoaFisicaController.show);// listando especifico
router.delete('/:id', loginRequired, pessoaFisicaController.delete); // deletando

export default router;
