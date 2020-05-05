const config = require('config');
const jasonwebtoken = require('jsonwebtoken');

function jwtPrivateKey() {
    if(!config.get('jwtPrivateKey')) {
        return false;
    }else{
        return config.get('jwtPrivateKey');
    }
}

function generateJsonWebToken(signObj) {
    return jasonwebtoken.sign(signObj, jwtPrivateKey());
}

module.exports.jwtPrivateKey = jwtPrivateKey;
module.exports.generate = generateJsonWebToken;


