const config = require('config');
const jasonwebtoken = require('jsonwebtoken');

function jwtPrivateKey() {
    if (!config.get('jwtPrivateKey')) {
        //return false;
        return "jwtPrivateKey";
    } else {
        return config.get('jwtPrivateKey');
    }
}

function generateJsonWebToken(signObj) {
    return jasonwebtoken.sign(signObj, jwtPrivateKey());
}

function verifyToken(token) {
    try {
        return jasonwebtoken.verify(token, jwtPrivateKey());
    } catch (error) {
        return null;
    }
}

module.exports.jwtPrivateKey = jwtPrivateKey;
module.exports.generate = generateJsonWebToken;
module.exports.verify = verifyToken;