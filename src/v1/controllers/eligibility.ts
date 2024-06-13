import express from 'express';
import axios from 'axios';

import { errResponse } from '../helpers';

export const findEligibility = async (req: express.Request, res: express.Response) => {
    try {
        const formData = {
            AccountKey: '18644_aXHu*NOki#SIrJMqhYMFG1Zf',
            ins_name_l: 'Avery',
            ins_name_f: 'Robert',
            payerid: '10096',
            pat_rel: '18',
            fdos: '20240522',
            prov_npi: '1902335623',
            service_code: '98',
            ins_number: '603298306',
            ins_dob: '19901207',
            ins_sex: 'M',
            prov_name_l: 'Cognitive Behavior Therapy and Assessment Associates'
        };
        
        const resp = await fetch(
            `https://svc.claim.md/services/eligdata/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: new URLSearchParams(formData).toString()
            }
        );
        
        const data = await resp.text();
        console.log(data);
    } catch (error) {
        console.log(error);
        return errResponse(res, 400, "CODE_ERROR", "Found message in code.");
    }
}