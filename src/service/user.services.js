import { google } from 'googleapis';
import { User } from "../models/user.model.js";
import axios from 'axios';
import bcrypt from 'bcrypt';
import pkg from 'lodash';
import { config } from '../utils/config.js';


const { get, omit, pick } = pkg;

const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/callback'
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

export async function createUser(input) {
    return await User.create(input);
}

export async function validateUser({ email, password }) {
    const user = User.findOne({ email: email })
    if (!user) {
        return false
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        return false
    }

    return omit(user.toJSON(), 'password');
}

export async function findUser(query) {
    const user = await User.findOne(query);
    if (!user) return false
    return user;
}

export async function getGoogleAuthorizationUrl() {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    })

    return { authorizationUrl }
}

export async function getGoogleUserData({ code }) {
    const { tokens } = await oauth2Client.getToken(code);
    const { id_token, access_token } = tokens

    try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                'Authorization': `Bearer ${id_token}`
            }
        })
        return res.data;
    } catch (error) {
        console.log(error.message)
    }
}

export async function findAndUpdateUser(query, update, options) {
    return await User.findOneAndUpdate(query, update, options)
}

export async function getFacebookUrl() {
    const fburl = 'https://www.facebook.com/v16.0/dialog/oauth';
    const redirect_uri = 'http://localhost:3000/api/auth/fb/callback';
    const scope = 'email,user_gender,user_link';
    const facebookUrl = `${fburl}?client_id=${config.FACEBOOKCLIENTID}&redirect_uri=${redirect_uri}&scope${scope}`;
    return { facebookUrl }
}

export async function getFacebookUserData({ code }) {
    const url = 'https://graph.facebook.com/v16.0/oauth/access_token';
    try {
        const res = await axios.get(url, {
            params: {
                client_id: config.FACEBOOKCLIENTID,
                client_secret: config.FACEBOOKCLIENTSECRET,
                redirect_uri: 'http://localhost:3000/api/auth/fb/callback',
                code: code
            }
        })
        const { access_token } = res.data;

        const userDataResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                fields: 'id,name,email,gender,link',
                access_token,
            },
        });

        
        return userDataResponse.data

    } catch (error) {
        console.log(error.message);
    }
}