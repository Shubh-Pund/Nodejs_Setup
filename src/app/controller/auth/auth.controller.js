const Model = require("../../models");
const { secret } = require("../../config/jwt.secret");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const { modelName, whereCondition, inputData } = req.body;

    if (!modelName) return res.fail("Model name is required.", []);
    if (!inputData) return res.fail("Input data is required.", []);
    if (!whereCondition) return res.fail("Where condition is required.", []);

    const user = inputData;
    const { password } = user;
    if (!password) return res.fail("Password is required.", []);

    const result = await Model[modelName].findOne({ where: whereCondition })
    if (result) return res.fail("User already exists!", []);

    const salt = await bcrypt.genSalt(10); // await for the salt generation
    const hash = await bcrypt.hash(password, salt); // await for the password hashing
    inputData.password = hash;
    await Model[modelName].create(user)
    return res.success("User created successfully.", []);
  } catch (error) {
    console.error('Error while creating user', error);
    return res.fail("Error while creating user", []);
  }
};

exports.login = async (req, res) => {
  try {
    const { whereCondition, username, password, modelName } = req.body;
    if (!whereCondition) return res.fail("Where condition is required.", []);
    if (!username) return res.fail("User name is required.", []);
    if (!password) return res.fail("Password is required.", []);
    if (!modelName) return res.fail("Model name is required.", []);

    const user = await Model[modelName].findOne({ where: whereCondition })
    if (!user) return res.fail("Username or Email id not found.", []);

    const { password: user_password } = user;
    const isValid = await bcrypt.compare(password, user_password);
    if (!isValid) return res.fail("Invalid Credential.", []);

    const token = jwt.sign({ id }, secret, { expiresIn: 86400 }); // 86400 is 24 hours
    return res.success("User logged in successfully.", { token });
  } catch (error) {
    console.error("Error during user authentication:", error);
    return res.catchError("Internal Server Error.", []);
  }
};

exports.setupLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.fail("User name and password is required!", []);
    }
    if (username == 'vinayaks') {
      const enryptedPassword = '$2a$12$MDPriJpbybk8j6rqSJAzDOlGxJWyRL1UoT2WlWCllHfNCx1/gjiCe';
      const isPasswordValid = await bcrypt.compare(password, enryptedPassword);
      if (!isPasswordValid) return res.fail("Password is not valid!", []);

      return res.success("Login Successfully", "success");
    } else {
      return res.fail("Wrong Credential!", []);
    }
  } catch (error) {
    console.error('Set up login error:', error);
    return null;
  }
}