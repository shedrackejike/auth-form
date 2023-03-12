const Joi = require("@hapi/joi")

const validateRegister = function (data) {
	const joischema =Joi.object({
		name:Joi.string().min(4).trim().required(),
		email:Joi.string().min(6).required().email(),
		password:Joi.string().min(8).required(),
	});

	return joischema.validate(data, { abortEarly: false });
};


const validateLogin = function (data) {
	const joischema =Joi.object({
		email:Joi.string().required().email().min(6),
		password:Joi.string().min(8).required(),
	});

	return joischema.validate(data, { abortEarly: false });
    
};		


module.exports = {
    validateRegister,validateLogin
}
