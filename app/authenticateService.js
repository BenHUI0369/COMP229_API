const Admin = require("./models/admin.model");

module.exports.loginuserDBService = (adminDetails) => {
  return new Promise(function myFn(resolve, reject) {
    Admin.findOne({ username: adminDetails.username }).then((data) => {
      if (!data) {
        reject({ status: false, msg: "Invaild Data" });
      } else {
        if (data != undefined && data != null) {
          if (data.password == adminDetails.password) {
            resolve({ status: true, msg: "User Validated Successfully" });
          } else {
            reject({ status: false, msg: "User Validated failed" });
          }
        } else {
          reject({ status: false, msg: "User Error Detailssss" });
        }
      }
    });
  });
};
