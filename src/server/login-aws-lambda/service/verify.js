const {buildResponse, verifyToken} = require('../utils')

function verify(payload) {
    console.log(`Hitting verify ${JSON.stringify(payload)}`);
    if (!payload || !payload.user || !payload.user.username || !payload.token) {
        return buildResponse(401, {
            message: 'Incorrect request body.'
        })
    }
     
    const {user, token} = payload;
    const verification = verifyToken(user.username, token);
    if (!verification.verified) {
        return buildResponse(401, {
            message: verification.message
        })
    } 
    return buildResponse(200, {
        verified: true,
        message: verification.message,
        user,
        token,
    });
}

module.exports.verify = verify