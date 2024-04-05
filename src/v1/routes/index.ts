import express from 'express';

const router = express.Router();

import change from './change_healthcare';

export default (): express.Router => {
    change(router);
    
    return router;
}