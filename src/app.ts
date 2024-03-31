import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import compression from 'compression';

const app = express();
dotenv.config();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());

app.use('/api', routes());

const server = http.createServer(app);
server.listen(8080, () => {
    console.log("Running server on https://localhost:8080/")
});