import express from 'express';

import { findEligibility } from '../controllers/eligibility';

export default (router: express.Router) => {
    router.get('/eligibility', findEligibility);
};