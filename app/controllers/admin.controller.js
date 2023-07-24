var AuthenticateService = require("../authenticateService");
const Admin = require("../models/admin.model");

var loginUserControllerFn = async (req, res) => {
  var result = null;
  try {
    result = await AuthenticateService.loginuserDBService(req.body);
    if (result.status) {
      res.send({ status: true, message: result.msg });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};

let createAccount = (req, res) => {
  if(!req.body) {
    return res.status(400).send({
        message: "Account and password cannot be empty"
    });
}

  // create an account
  const admin = new Admin({
    username: req.body.username,
    password: req.body.password
  });

  //save admin in the database
  //save is the method for mongo db
  admin.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occured while creating account"
      });
  });
};

module.exports = { 
  loginUserControllerFn,
  createAccount
};
