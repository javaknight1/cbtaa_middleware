import express from 'express';
import axios from 'axios';
import * as fs from 'fs';

import { errResponse } from '../helpers';

const fileName: string = 'src/v1/coverage_qualifiers.txt';
const GENERAL_COVERAGE: string = "Health Benefit Plan Coverage";

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
            vendor: req.body.vendor,
            specialtyId: 22
        }
    };

    console.log("Searching " + req.body.first + " " + req.body.last + "...");

    let qualifiers = fs.readFileSync(fileName, 'utf8').split("\n");

    axios.request(options)
        .then(function (response) {
            var result: any = {
                "status": "success",
                "result": {
                    "type": response.data.vob.plan.type,
                    "oon": false,
                    "dates": {
                        "start": response.data.vob.plan.planDateBegin,
                        "end": response.data.vob.plan.planDateEnd
                    },
                    "coinsurance": {
                        "estimate": 0.0,
                        "source": []
                    },
                    "oon_individual_deductible": 0.0,
                    "oon_individual_deductible_fulfilled": 0.0,
                    "oon_individual_deductible_remaining": 0.0,
                    "oon_individual_out_of_pocket_max": 0.0,
                    "oon_individual_out_of_pocket_spent": 0.0,
                    "oon_individual_out_of_pocket_remaining": 0.0,
                    "oon_family_deductible": 0.0,
                    "oon_family_deductible_fulfilled": 0.0,
                    "oon_family_deductible_remaining": 0.0,
                    "oon_family_out_of_pocket_max": 0.0,
                    "oon_family_out_of_pocket_spent": 0.0,
                    "oon_family_out_of_pocket_remaining": 0.0
                },
                "full_results": response.data
            };
            var coverages: any = [];
            for (var i = 0; i < response.data.vob.coverages.length; i++) {
                const coverage = response.data.vob.coverages[i];
                console.log(coverage.name);
                if (coverage.name == GENERAL_COVERAGE && !coverage.inNetwork) {
                    // Individual
                    result['result']['oon_individual_deductible'] = coverage.individual.deductible.value;
                    result['result']['oon_individual_deductible_fulfilled'] = coverage.individual.deductibleMet.value;
                    result['result']['oon_individual_deductible_remaining'] = coverage.individual.deductibleRemaining.value;
                    result['result']['oon_individual_out_of_pocket_max'] = coverage.individual.outOfPocket.value;
                    result['result']['oon_individual_out_of_pocket_spent'] = coverage.individual.outOfPocketMet.value;
                    result['result']['oon_individual_out_of_pocket_remaining'] = coverage.individual.outOfPocketRemaining.value;

                    // Family
                    result['result']['oon_family_deductible'] = coverage.family.deductible.value;
                    result['result']['oon_family_deductible_fulfilled'] = coverage.family.deductibleMet.value;
                    result['result']['oon_family_deductible_remaining'] = coverage.family.deductibleRemaining.value;
                    result['result']['oon_family_out_of_pocket_max'] = coverage.family.outOfPocket.value;
                    result['result']['oon_family_out_of_pocket_spent'] = coverage.family.outOfPocketMet.value;
                    result['result']['oon_family_out_of_pocket_remaining'] = coverage.family.outOfPocketRemaining.value;

                    console.log(result);
                }

                for (var j = 0; j < qualifiers.length; j++) {
                    const qualifier = qualifiers[j];
                    if (coverage.name.includes(qualifier)) {
                        coverages.push(coverage);
                    } 
                }
            }
            console.log(result);
            res.status(200).json(result).end();
        })
        .catch(function (error) {
            console.error(error);
            errResponse(res, error.response.status, error.response.statusText, error.response.data.warnings);
        });
}