/* eslint-disable import/no-named-as-default */
import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/Usercontroller';
import SessionsAdmController from './app/controllers/SessionsAdmController';
import SessionsShopkeeperController from './app/controllers/SessionsShopkeeperController';
import ShopkeeperProfileController from './app/controllers/ShopkeeperProfileController';
import DocumentController from './app/controllers/DocumentController';
import FileController from './app/controllers/FileController';
import ShopkeeperController from './app/controllers/ShopKeeperController';
import ReportController from './app/controllers/ReportController';
import ListController from './app/controllers/ListController';
import SolicitationController from './app/controllers/SolicitationController';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);


/* Sessions adm  */
routes.post('/sessions_adm', SessionsAdmController.store);

/* Sessions shopkeeper  */
routes.post('/sessions_shopkeeper', SessionsShopkeeperController.store);

/* Sessions Solicitations */
routes.get('/solicitations', SolicitationController.index);
routes.get('/solicitations/:document_id', SolicitationController.showbydoc);
routes.post('/solicitations/reports', SolicitationController.store);

/*routes.use(authMiddleware);*/

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

/* List for shopkeeper */
routes.get('/list', ListController.index);

/* Management reports */
routes.post('/reports', ReportController.store);
routes.get('/reports', ReportController.index);
routes.get('/reports/:shopkeeperId', ReportController.show);
routes.put('/reports/:shopkeeperId', ReportController.update);
routes.delete('/reports/:shopkeeperId', ReportController.delete);

/* upload de files */
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files', FileController.index);
routes.get('/files/:id', FileController.show);
routes.delete('/files/:id', FileController.delete);


/* Profile user admin brmalls*/
routes.post('/user_admin', UserController.store);
routes.put('/user_admin', UserController.update);

/* Routes for user shopkeeper */
routes.put('/shopkeeper_profile', ShopkeeperProfileController.update);

export default routes;
