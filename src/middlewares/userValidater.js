const Joi = require('joi');
const { signupSchema, editSchema, editPasswordSchema, productSchema } = require("./yupSchema")



const userValidate = async (req, res, next) => {
    try {
        req.body = await signupSchema.validate(req.body);
        next();
    } catch (err) {
        return res.status(404).send({ message: err.errors[0] })
    }

}

const vaidateEdit = async (req, res, next) => {
   console.log(req.body);
    try {
        req.body = await editSchema.validate(req.body);
        next();
    } catch (err) {
        return res.status(404).send({ message: err.errors[0] })
    }

}
const vaidatePassword = async (req, res, next) => {
    console.log(req.body);
    try {
        req.body = await editPasswordSchema.validate(req.body);
        next();
    } catch (err) {
        return res.status(404).send({ message: err.errors[0] })
    }

}

const validateProduct = async (req, res, next) => {
    console.log(req.body);
    try {
        req.body = await productSchema.validate(req.body);
        next();
    } catch (err) {
        return res.status(404).send({ message: err.errors[0] })
    }

}


module.exports.userValidate = userValidate;
module.exports.vaidatePassword = vaidatePassword;
module.exports.vaidateEdit = vaidateEdit;
module.exports.validateProduct = validateProduct;