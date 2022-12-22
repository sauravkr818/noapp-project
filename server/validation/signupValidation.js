const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    console.log(data);
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword)
        ? data.confirmPassword
        : "";

    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.err = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.err = "Email is invalid";
    }
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.err = "Password field is required";
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.err = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.err = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.err = "Passwords must match";
    }
    
    return {
        errors,
        isValid: isEmpty(errors),
    };
};
