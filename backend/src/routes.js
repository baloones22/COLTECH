/* eslint-disable import/no-named-as-default */
import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/Usercontroller';
import SessionsAdmController from './app/controllers/SessionsAdmController';
import DocumentController from './app/controllers/DocumentController';
import FileController from './app/controllers/FileController';
import ShopkeeperController from './app/controllers/ShopKeeperController';
import ReportController from './app/controllers/ReportController';

// eslint-disable-next-line import/no-named-as-default
// eslint-disable-next-line import/no-named-as-default-member
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/* User admins  */
routes.post('/user_admin', UserController.store); //deletar a rota quando estiver em produção

/* Sessions adm  */
routes.post('/sessions_adm', SessionsAdmController.store);

routes.use(authMiddleware);

/* Management documets */
routes.post('/documents', DocumentController.store);
routes.get('/documents', DocumentController.index);
routes.get('/documents/:id', DocumentController.show);
routes.put('/documents/:id', DocumentController.update);
routes.delete('/documents/:id', DocumentController.delete);

/* Management Shopkeeper */
routes.post('/shopkeeper', ShopkeeperController.store);
routes.get('/shopkeeper', ShopkeeperController.index);
routes.get('/shopkeeper/:id', ShopkeeperController.show);
routes.put('/shopkeeper/:id', ShopkeeperController.update);
routes.delete('/shopkeeper/:id', ShopkeeperController.delete);

/* Management reports */
routes.post('/reports', ReportController.store);
routes.get('/reports', ReportController.index);
routes.get('/reports/:shopkeeperId', ReportController.show);
routes.put('/reports/:shopkeeperId', ReportController.update);
routes.delete('/reports/:shopkeeperId', ReportController.delete);

/* upload de files */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
