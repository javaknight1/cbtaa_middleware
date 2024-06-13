
export const errResponse = (res: any, code: number, status: string, message: string) => res.status(code).json({ status, message }).end();