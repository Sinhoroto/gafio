import express from 'express';
import DiseaseController from '../controllers/Disease';

const routes = express.Router();
const disease = new DiseaseController();

routes.post('/disease', disease.create);
routes.post('/disease/importDB', disease.importDB);
routes.get('/disease', disease.index);
routes.get('/disease/name/:name', disease.indexByName);
routes.get('/disease/diseaseCode/:diseaseCode', disease.indexByCode);
routes.get('/disease/paginate/:page', disease.indexByPage);
routes.delete('/disease', disease.delete);
routes.delete('/disease/deleteAll', disease.deleteAll);

export default routes;