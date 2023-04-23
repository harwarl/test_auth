import { createUser, validateUser, getGoogleAuthorizationUrl, getGoogleUserData, findAndUpdateUser } from "../service/user.services.js";
import { createAccessToken, createSession } from "../service/session.services.js"
import pkg from 'lodash';
import axios from 'axios';
import qs from 'qs';
import { signToken } from "../utils/jwt.utils.js";

const { get, pick, omit } = pkg;

export async function signup(req, res, next){
    try{
        const user = await createUser(req.body);
        const data = omit(user, 'password');
        return res.status(201).send(data);
    }catch(error){
        console.log(error.message);
    }

    
}

export async function signin(req, res, next){
    const { email, password } = req.body;
    const user = await validateUser({email, password});
    if(!user){
        return res.status(401).send('Unauthorized');
    }

    //create session
    const userAgent = req.get('user-agent');
    const session = await createSession(user, userAgent || "");

    //create a token
    const access_token = await createAccessToken({user, session})
    res.setHeader('Authorization', access_token);
    const refresh_token = signToken(session, {expiresIn: '1y'});
    res.setHeader('x-refresh', refresh_token);

    res.status(200).send({access_token, refresh_token});
}


export async function logout(req, res, next){
    const session = get(req, 'user.session');

    const result = await updateSession({_id: session}, {valid: false});

    return res.status(200).send('Logged out!!!')
}

export async function  googleSignIn(req, res, next){
    const { authorizationUrl } = await getGoogleAuthorizationUrl();

    res.status(301).redirect(authorizationUrl)
}

export async function getGoogleUserInfo(req, res, next){
    const { code } = req.query;

    //get UserData
    const user_data = await getGoogleUserData({ code })
    if(!user_data.verified_email){
        return res.status(403).send('Email not verified');
    }

    const user_saved = await findAndUpdateUser({email: user_data.email}, {
        email: user_data.email,
        name: user_data.name
    }, {
        upsert: true,
        new: true
    })

    //create a session
    const userAgent = req.get('user-agent');
    const session = await createSession(user_saved, userAgent || "");

    //create access and RefreshToken
    const accessToken = await createAccessToken({user_saved, session});
    const refreshToken = signToken(session, {expiresIn: '1y'});

    //create cookies
    res.cookie(
        'accessToken', accessToken, {
            maxAge: 90000,//15mins
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            secure: false
        }
    )

    res.cookie('refreshToken', refreshToken, {
        maxAge: 3.154e10, //1 year
        httpOnly: true,
        domain: 'localhost',
        path:'/',
        sameSite: 'strict',
        secure: false
    })
}

export async function facebookSignIn(req, res, next){
    const fb_url = 'https://www.facebook.com/v16.0/dialog/oauth'
    const config = {
        params: {
            client_id: '905302157364048',
            redirect_uri: "http://localhost:3000/api/auth/fb/callback",
            state: "{st: bubu}"
        }
    }
    try{
        const res = await axios.get(fb_url, config)
        console.log(res.data);
    }catch(error){
        console.log(error.message)
    }
}

export async function getFacebookUserInfo(req, res, next){

}