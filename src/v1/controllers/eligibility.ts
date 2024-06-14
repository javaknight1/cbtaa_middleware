import express from 'express';
import axios from 'axios';

import { errResponse } from '../helpers';

export const findEligibility = async (req: express.Request, res: express.Response) => {
    const options = {
        method: 'POST',
        url: 'https://portal.instantvob.com/api/instant-vob',
        headers: {
            accept: 'application/json',
            'x-api-key': req.body.key,
            'content-type': 'application/json'
        },
        data: {
            // specialtyId: null,
            includePDF: false,
            memberId: req.body.member,
            firstName: req.body.first,
            lastName: req.body.last,
            dateOfBirth: req.body.dob,
            vendor: req.body.vendor
        }
    };

    axios.request(options)
        .then(function (response) {
            console.log(response.data);
            const result = {
                "status": "success",
                "result": {
                    "type": response.data.vob.plan.type,
                    "oon": false,
                    "dates": {
                        "start": response.data.vob.plan.planDateBegin,
                        "end": response.data.vob.plan.planDateEnd
                    },
                    "individual": {},
                    "family": {}
                }
            };
            for (var i = 0; i < response.data.vob.coverages.length; i++) {
                const coverage = response.data.vob.coverages[i];
                if (coverage.name == "Mental Health Provider  - Outpatient") {
                    result["result"]["oon"] = result["result"]["oon"] || coverage.inNetwork;
                    result["result"]["individual"] = coverage.individual;
                    result["result"]["family"] = coverage.family;
                }
            }
            res.status(200).json(result).end();
        })
        .catch(function (error) {
            console.error(error.response);
            errResponse(res, error.response.status, error.response.statusText, error.response.data.warnings);
        });
}