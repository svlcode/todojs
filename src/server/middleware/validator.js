const Joi = require('@hapi/joi');

function validator(req, res, next) {
    if(req.method === 'POST' || req.method === 'PUT') {
        const { error } = validateTask(req.body);
        if(error) {
            console.log(error);
            // 400  - Bad Request
            res.status(400).send(`Bad Request. ${error.details[0].message}`);
        }
        else {
            next();
        }
    }
    else {
        next();
    }
    
}


function validateTask(task) {
    const schema = Joi.object().keys({ 
        text: Joi.string().min(3).max(30).required(),
        checked: Joi.boolean().required()
    });

    return Joi.validate(task, schema);
}


module.exports = validator;