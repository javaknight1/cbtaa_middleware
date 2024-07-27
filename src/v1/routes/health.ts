import express from 'express';

import { getHealth } from '../controllers/health';

export default (router: express.Router) => {
    router.get('/health', getHealth);
};