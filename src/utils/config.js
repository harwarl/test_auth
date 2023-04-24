import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();


export const config = {
    PORT: env.PORT,
    DBURL : env.DBURL,
    ACCESSTOKEN: env.ACCESSTOKEN,
    FACEBOOKCLIENTID: env.FACEBOOK_CLIENT_ID,
    FACEBOOKCLIENTSECRET: env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET
}