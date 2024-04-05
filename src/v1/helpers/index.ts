import axios from "axios";
import qs from "qs";

export const errResponse = (res: any, code: number, status: string, message: string) => res.status(code).json({ status, message }).end();

export const getAuthToken = async () => {
    let token
    try {
        let data = await axios({
            method: 'post',
            url: 'https://sandbox.apigw.changehealthcare.com/auth/oauth/v2/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({
                'grant_type': 'client_credentials',
                'client_id': process.env.CH_CLIENT_ID,
                'client_secret': process.env.CH_CLIENT_SECRET
            })
        });
        token = data.data.access_token;
    } catch (error) {
        console.error(error);
    }
    return token;
}