export function validator(schema, method){
    return (req, res, next) => {
    const { error } = schema.validate(req[method], {abortEarly: false});
    if(error){
        console.log(error.details[0].message);
    }else{
        next();
    }
    }
}