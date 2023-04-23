import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userAgent: {
        type: String,
        required: true
    },
    valid: {
        type: Boolean,
        default: true
    }
}, { timestamps: true})

const Session = model('Session', sessionSchema);

export { Session }