const {buildResponse} = require('./utils');

const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
    console.log(`Requested event ${event}`);

    let response;
    const httpMethod = event.httpMethod;
    const path = event.path;
    
    if (httpMethod === 'GET' && path === '/health') {
        response = buildResponse(200);
    } else if (httpMethod === 'POST' && path === '/register') {
        response = await registerService.register(JSON.parse(event.body));
    } else if (httpMethod === 'POST' && path === '/login') {
        response = await loginService.login(JSON.parse(event.body)); 
    } else if (httpMethod === 'POST' && path === '/verify') {
        response = verifyService.verify(JSON.parse(event.body));
    } else {
        response = buildResponse(404);
    }
    return response;
};