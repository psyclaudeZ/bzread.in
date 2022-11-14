var _a = require('../utils'), buildResponse = _a.buildResponse, verifyToken = _a.verifyToken;
function verify(payload) {
    if (!payload || !payload.user || !payload.user.username || !payload.token) {
        return buildResponse(401, {
            message: 'Incorrect request body.'
        });
    }
    var user = payload.user, token = payload.token;
    var verification = verifyToken(user.username, token);
    if (!verification.verified) {
        return buildResponse(401, {
            message: verification.message
        });
    }
    return buildResponse(200, {
        verified: true,
        message: verification.message,
        user: user,
        token: token,
    });
}
module.exports.verify = verify;
