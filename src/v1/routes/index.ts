import express from 'express';

const router = express.Router();

import eligibility from './eligibility';
import health from './health';

export default (): express.Router => {
    eligibility(router);
    health(router);
    
    return router;
}