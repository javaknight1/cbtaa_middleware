import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import v1routes from './v1/routes';
import compression from 'compression';

const app = express();
dotenv.config();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());

app.use('/api/v1', v1routes());

const server = http.createServer(app);
server.listen(80, () => {
    console.log("Running server on https://localhost:80/")
});