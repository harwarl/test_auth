import { connect } from 'mongoose';
import { config } from '../utils/config.js';

export function connectDb(){
    const url = config.DBURL;
    return connect(url)
    .then(()=>{
        console.log('Connected')
    })
    .catch((error)=>{
        console.log(error.message)
    })
}