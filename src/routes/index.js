import { router as authRouter } from "./auth.route.js";

export function bootStrap(app){
    app.get('/pingit', (req, res, next)=>{
        res.send('Pong')
    })
    app.use('/api/auth', authRouter);




}