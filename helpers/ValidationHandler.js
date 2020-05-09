
class ValidationHandler{

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION
    setInputValidation(joiValidationResult) {
        return {
            type    : 'input',
            key     : joiValidationResult.error.details[0].context.key,
            value   : joiValidationResult.value,
            message : joiValidationResult.error.details[0].message,
            isError : true
        }
    }

    // DATABASE ENTRY VALIDATION
    setDatabaseValidation(isError, message) {
        return {
            type    : 'db',
            key     : null,
            value   : null,
            message : message,
            isError : isError
        }
    }

    // BASIC CRUD OPERATION VALIDATIONS
    setBasicValidation(isError, message) {
        return {
            type    : 'basic',
            key     : null,
            value   : null,
            message : message,
            isError : isError
        }
    }
}

module.exports = ValidationHandler;