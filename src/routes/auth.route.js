import { getGoogleUserInfo, googleSignIn, logout, signin, signup, facebookSignIn, getFacebookUserInfo } from "../controllers/auth.js";
import { Router } from 'express';
import { joiSchema } from "../utils/joiSchema.js";
import { validator } from "../middleware/validator.js";
import { auth } from "../middleware/is_auth.js";
const router = Router();

router.post('/signup', validator(joiSchema.signUp, 'body'), signup);
router.post('/signin', validator(joiSchema.login, 'body'), signin);
router.post('/logout', auth, logout);
router.get('/googlesignin', googleSignIn);
router.get('/callback', getGoogleUserInfo);
router.get('/facebooksignin', facebookSignIn);
router.get('/fb/callback', getFacebookUserInfo);

//twitter oauth


export { router }