const bcrypt = require('bcryptjs');
const {buildResponse, generateToken, getUserInfoFromDynamo} = require('../utils');

async function login(user) {
    const {username, password} = user;

    if (!username || !password) {
        return buildResponse(401, {
            message: 'Missing required information.'
        })
    }

    const dynamoUser = await getUserInfoFromDynamo(username.toLowerCase().trim());
    if (!dynamoUser || !dynamoUser.username) {
        return buildResponse(403, {   
            message: 'User does not exist.'
        })
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)) {
        return buildResponse(403, {
            message: 'Incorrect password.',
        })
    }

    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name,
    }
    const token = generateToken(userInfo);
    const response = {
        user: userInfo,
        token: token,
    }
    return buildResponse(200, response);
}

module.exports.login = login