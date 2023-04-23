import jwt from 'jsonwebtoken';
import { config } from './config.js';

export function signToken(object, options){
    return jwt.sign( object, config.ACCESSTOKEN,  options );
}

export async function decodeToken(token){
    try{
        const decoded = await jwt.decode(token, config.ACCESSTOKEN);
        return {
            expired: false,
            decoded: decoded,
            valid: true
        }
    }catch(e){
        return {
            expired: e.message === 'jwt expired',
            decoded: null,
            valid: false
        }
    }
}