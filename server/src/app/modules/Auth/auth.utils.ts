import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (payload:{user: string, password: string}, secretKey : string, expiresIn : string ) => {
    return jwt.sign(payload, secretKey, { expiresIn });
}
export const verifyToken = (token: string, secretKey: string) => {
    return jwt.verify(token, secretKey) as JwtPayload;
}
