import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const JoiPassword = Joi.extend(joiPasswordExtendCore);
export const joiSchema = {
    signUp: Joi.object({
        name:  Joi.string().required(),
        email: Joi.string().email().required(),
        password: JoiPassword.string()
        .minOfUppercase(1)
        .minOfLowercase(1)
        .minOfSpecialCharacters(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: JoiPassword
        .string()
        .minOfUppercase(1)
        .minOfLowercase(1)
        .minOfSpecialCharacters(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required()
    })
}