import express from 'express';

import { findBenefits } from '../controllers/change_healthcare';

export default (router: express.Router) => {
    router.get('/benefits', findBenefits);
};