import express from 'express';
import axios from 'axios';
import * as fs from 'fs';

import { errResponse } from '../helpers';

const fileName: string = 'src/v1/coverage_qualifiers.txt';
const GENERAL_COVERAGE: string = "Health Benefit Plan Coverage";

export const findEligibility = async (req: express.Request, res: express.Response) => {

    var missing: string[] = []
    if (!req.body.key) {
        missing.push("key");
    }
    if (!req.body.member) {
        missing.push("member");
    }
    if (!req.body.first) {
        missing.push("first name");
    }
    if (!req.body.last) {
        missing.push("last name");
    }
    if (!req.body.dob) {
        missing.push("dob");
    }
    if (!req.body.vendor) {
        missing.push("vendor");
    }

    if (missing.length > 0) {
        errResponse(res, 404, "MISSING_FIELDS", "You are missing some fields: " + missing.join(", "));
        return;
    }

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
            includePDF: true,
            memberId: req.body.member,
            firstName: req.body.first,
            lastName: req.body.last,
            dateOfBirth: req.body.dob,
            vendor: req.body.vendor
        }
    };

    // if (req.body.specialty) {
    //     options.data['specialtyId'] = req.body.specialtyId;
    // }

    // console.log("Searching " + req.body.first + " " + req.body.last + "...");

    let qualifiers = fs.readFileSync(fileName, 'utf8').split("\n");

    axios.request(options)
        .then(function (response) {
            var result: any = {
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
            };
            var coinsurances_mental: any = [];
            var coinsurances_general: any = {};
            var coinsurances_other: any = [];
            for (var i = 0; i < response.data.vob.coverages.length; i++) {
                const coverage = response.data.vob.coverages[i];

                if (!coverage.inNetwork) {
                    continue;
                }

                if (coverage.name == GENERAL_COVERAGE) {
                    // Individual
                    result['oon_individual_deductible'] = coverage.individual.deductible.value;
                    result['oon_individual_deductible_fulfilled'] = coverage.individual.deductibleMet.value;
                    result['oon_individual_deductible_remaining'] = coverage.individual.deductibleRemaining.value;
                    result['oon_individual_out_of_pocket_max'] = coverage.individual.outOfPocket.value;
                    result['oon_individual_out_of_pocket_spent'] = coverage.individual.outOfPocketMet.value;
                    result['oon_individual_out_of_pocket_remaining'] = coverage.individual.outOfPocketRemaining.value;

                    // Family
                    result['oon_family_deductible'] = coverage.family.deductible.value;
                    result['oon_family_deductible_fulfilled'] = coverage.family.deductibleMet.value;
                    result['oon_family_deductible_remaining'] = coverage.family.deductibleRemaining.value;
                    result['oon_family_out_of_pocket_max'] = coverage.family.outOfPocket.value;
                    result['oon_family_out_of_pocket_spent'] = coverage.family.outOfPocketMet.value;
                    result['oon_family_out_of_pocket_remaining'] = coverage.family.outOfPocketRemaining.value;

                    coinsurances_general = coverage;

                } else if (coverage.name.includes("other")) {
                    coinsurances_other.push(coverage);
                } else {
                    for (var j = 0; j < qualifiers.length; j++) {
                        const qualifier = qualifiers[j];
                        if (coverage.name.includes(qualifier)) {
                            coinsurances_mental.push(coverage);
                            break;
                        } 
                    }
                }
            }
            console.log("General: " + coinsurances_general);
            console.log("Mental: " + coinsurances_mental);
            console.log("Other: " + coinsurances_other);

            // // Calulate estimate
            // if (coinsurances_mental.length > 1) {
            //     for (var i=0; i < coinsurances_mental.length; i++) {
            //         const coverage = coinsurances_mental[i];
            //         for (var j=0; j < coverage['coInsurance'].length; j++) {

            //         }
            //     }
            // } else if (coinsurances_general) {

            // } else if (coinsurances_other.length > 0) {

            // }
            
            res.status(200).json({
                "status": "success",
                "result": result,
                "full_result": response.data
            }).end();
        })
        .catch(function (error) {
            console.error(error);
            errResponse(res, error.response.status, error.response.statusText, error.response.data.warnings);
        });
}