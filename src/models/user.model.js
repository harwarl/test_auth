import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true})


userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    const hashedPassword = bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    return next();
})

userSchema.methods.comparePassword = async function(password){
    const user = this;
    return await bcrypt.compare(password, user.password).catch((e) => {return false})
}

export const User = model('User', userSchema);