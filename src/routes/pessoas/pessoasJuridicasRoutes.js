import { Router } from 'express';
import pessoaJuridicaController from '../../controllers/pessoas/PessoaJuridicaController';
import loginRequired from '../../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, pessoaJuridicaController.index); // listando todas
router.post('/', loginRequired, pessoaJuridicaController.store); // criando
router.put('/:id', loginRequired, pessoaJuridicaController.update);// editando
router.get('/:id', loginRequired, pessoaJuridicaController.show);// listando especifico
router.delete('/:id', loginRequired, pessoaJuridicaController.delete); // deletando

export default router;
