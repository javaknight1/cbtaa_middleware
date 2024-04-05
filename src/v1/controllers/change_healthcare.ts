import express from 'express';
import axios from 'axios';

import { errResponse, getAuthToken } from '../helpers';

export const findBenefits = async (req: express.Request, res: express.Response) => {

    try {
        if (!req.body.organizationName || !req.body.serviceProviderNumber || !req.body.providerCode || 
            !req.body.referenceIdentification || !req.body.memberId || !req.body.firstName || 
            !req.body.lastName || !req.body.gender || !req.body.dateOfBirth || !req.body.ssn ||
            !req.body.insuranceId || !req.body.beginningDateOfService || !req.body.endDateOfService ||
            !req.body.CPTCode || !req.body.controlNumber || !req.body.tradingPartnerServiceId) {
            return errResponse(res, 400, "MISSING_FIELDS", "Some required fields are missing.");
        }

        let reqData = {
            "provider": {
                "organizationName": req.body.organizationName,
                "npi": "1902335623",
                "serviceProviderNumber": req.body.serviceProviderNumber,
                "providerCode": req.body.providerCode,
                "referenceIdentification": req.body.referenceIdentification
            },
            "subscriber": {
                "memberId": req.body.memberId,
                "firstName":req.body.firstName,
                "lastName": req.body.lastName,
                "gender": req.body.gender,
                "dateOfBirth": req.body.dateOfBirth,
                "ssn": req.body.ssn,
                "idCard": req.body.insuranceId // subscriber’s insurance plan card number
            },
            "encounter": {
                "beginningDateOfService": req.body.beginningDateOfService,
                "endDateOfService": req.body.endDateOfService,
                "productOrServiceIDQualifier": "CJ",
                "procedureCode": req.body.CPTCode,
                "serviceTypeCodes": [
                    "98"
                ]
            },
            "controlNumber": req.body.controlNumber,
            "tradingPartnerServiceId": req.body.tradingPartnerServiceId,
        };
        let token = "FIND_THE_TOKEN_IN_THE_DOCS_AND_REPLACE_THIS_STRING";

        let data = await axios({
            method: 'get',
            url: 'https://sandbox.apigw.changehealthcare.com/medicalnetwork/eligibility/v3/',
            headers: { 'Authorization': `Bearer ${getAuthToken}`, 'Content-Type': 'application/json' },
            data: reqData
        });

        console.log(data.data);

        res.status(200).json({
            'last_run': new Date().toISOString(),
            'total_runs': 1,
            'status': 'complete',
            'error_detail': 'TBD',
            'insurance_type': 'PPO',
            'has_oon_coverage': true,
            'percent_allowable_paid': '80%',
            'oon_individual_deductible': '$5000',
            'oon_individual_deductible_fulfilled_to_date': '$2000',
            'oon_individual_deductible_remaining': '$3000',
            'oon_family_deductible_total': '$10000',
            'oon_family_deductible_fulfilled_to_date': '$4000',
            'oon_family_deductible_remaining': '$6000'
        }).end();
    } catch (error) {
        console.log(error);
        return errResponse(res, 400, "CODE_ERROR", "Found message in code.");
    }
};