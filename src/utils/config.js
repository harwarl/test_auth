import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();


export const config = {
    PORT: env.PORT,
    DBURL : env.DBURL,
    ACCESSTOKEN: env.ACCESSTOKEN
}