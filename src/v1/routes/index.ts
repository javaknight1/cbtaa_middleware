import express from 'express';

const router = express.Router();

import eligibility from './eligibility';

export default (): express.Router => {
    eligibility(router);
    
    return router;
}