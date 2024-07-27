import express from 'express';

export const getHealth = async (req: express.Request, res: express.Response) => {
    res.status(200).end();
}