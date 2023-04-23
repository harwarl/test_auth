import { Session } from '../models/session.model.js'
import { decodeToken, signToken } from '../utils/jwt.utils.js';
import pkg from "lodash";
import { findUser } from './user.services.js';


const { get, pick, omit } = pkg
export async function createSession(user, userAgent){
    const session = await Session.create({
        user: user._id,
        userAgent: userAgent
    })
    return session.toJSON();
}

export async function createAccessToken({ user, session }){
    const userIm = pick(user, ['_id', 'email']);
    return signToken({...userIm, session: session._id}, {expiresIn: '15m'})
}

export async function updateSession(query, update){
    const session = await Session.updateOne(query, update);
    console.log(session);
    return session;
}

export async function reIssueAccessToken({ refreshToken }){
    const { decoded } = await decodeToken(refreshToken);

    if(!decoded || !decoded._id){
        return false
    }

    const session = await Session.findOne({_id: get(decoded, "_id")})

    if(!session && !session?.valid) return false
    const user = await findUser({_id: session.user });
    if(!user) return false;

    const accessToken = createAccessToken({ user, session})

    return accessToken;
}

