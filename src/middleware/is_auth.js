import pkg from 'lodash';
import { decodeToken } from '../utils/jwt.utils.js';
import { reIssueAccessToken } from '../service/session.services.js';

export async function auth(req, res, next){
    if(!req.get('Authorization')){
        console.log('Authorization Header is not Present')
    }

    const accessToken = get(req, 'headers.Authorization').replace(
        /^Bearer\s/,
        ""
    )

    const refreshToken = get(req, 'headers.x-refresh');
    if(!accessToken){
        return res.sendStatus(403);
    }

    const { decoded, expired } = await decodeToken(accessToken);

    if(decoded){
        req.user = decoded;
        next();
    }

    if(expired && refreshToken){
        const newAccessToken = await reIssueAccessToken({refreshToken})
        const { decoded } = await decodeToken(newAccessToken);
        req.user = decoded;
        next()
    }

    return res.sendStatus(403);
}