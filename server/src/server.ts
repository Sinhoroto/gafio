import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

let port = 3333;
console.log("Running on: " + port);
app.listen(port);
