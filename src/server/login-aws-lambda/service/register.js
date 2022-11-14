const bcrypt = require("bcryptjs");
const {
  buildResponse,
  getUserInfoFromDynamo,
  saveUserInfoToDynamo,
} = require("../utils");

async function register(payload) {
  const { name, email, username, password } = payload;

  if (!name || !email || !username || !password) {
    return buildResponse(400, {
      message: "Missing required information.",
    });
  }

  const dynamoUser = await getUserInfoFromDynamo(username);
  if (dynamoUser && dynamoUser.username) {
    return buildResponse(401, {
      message: "Username already exists.",
    });
  }

  // hashSync?
  const encryptedPassword = await bcrypt.hash(password.trim(), 10);
  const userEntry = {
    name,
    email,
    username: username.toLowerCase().trim(),
    password: encryptedPassword,
  };

  const saveUserResponse = await saveUserInfoToDynamo(userEntry);
  if (!saveUserResponse) {
    return buildResponse(503, { message: "Unable to save user." });
  }
  return buildResponse(200, { username });
}

module.exports.register = register;
