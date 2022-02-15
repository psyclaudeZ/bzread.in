const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const usersTable = 'techro-users';

function buildResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }
}

function generateToken(userInfo) {
    if (!userInfo) {
        return null;
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

function verifyToken(username, token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return {
                verified: false,
                message: 'Invalid token.'
            }
        }

        if (decoded.username !== username) {
            return {
                verified: false,
                message: 'Invalid user.'
            }
        }
        return {
            verified: true,
            message: 'Token verified.'
        }
    })
}

async function getUserInfoFromDynamo(username) {
    const params = {
        TableName: usersTable,
        Key: {
            username: username.toLowerCase().trim()
        }
    }
    return await dynamoDb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.log(`Error fethching user ${error}`);
    })
}

async function saveUserInfoToDynamo(userEntry) {
    const params = {
        TableName: usersTable,
        Item: userEntry
    }
    return await dynamoDb.put(params).promise().then(response => {
        return response;
    }, error => {
        console.log(`Error saving user ${error}`);
    })
}

module.exports = {
    buildResponse,
    generateToken,
    getUserInfoFromDynamo,
    saveUserInfoToDynamo,
    verifyToken,
}