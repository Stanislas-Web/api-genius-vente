const bcrypt = require("bcrypt");

const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const number = req.body.number;
  const username = req.body.username;
  const email = req.body.email;
  const entreprise = req.body.entreprise;
  const adress = req.body.adress;
  const country = req.body.country;
  const ville = req.body.ville;
  const Category = req.body.Category;
  const whatsapp = req.body.whatsapp;



  const numberExist = await User.findOne({ number: number });

  if (numberExist) {
    return res.status(400).send({
        message:"ce numéro de télephone existe déjà "
    });
  } else {
    const user = new User({
      username: username,
      password: password,
      number: number,
      email: email,
      entreprise: entreprise,
      adress: adress,
      country: country,
      ville: ville,
      Category: Category,
      whatsapp: whatsapp
    });

    const result = await user.save();

    return res.status(200).send({
      message: "User Registration Successfully",
      data: result,
      token: jwt.sign(
        { name: result.username, number: result.number, _id: result._id },
        "RESTFULAPIs"
      ),
    });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const user = await User.findOne({ number: req.body.number });
  console.log(user);
  if (user) {
    // OTP Login
    const otpHolder = await Otp.find({
      number: req.body.number,
    });
    if (otpHolder.length === 0)
      return res.status(400).send("You use an Expired OTP");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
      const result = await User.findOne({ number: req.body.number });
      return res.status(200).send({
        message: "User login Successfully",
        data: result,
        token: jwt.sign(
          { name: result.name, number: result.number, _id: result._id },
          "RESTFULAPIs"
        ),
      });
    } else {
      return res.status(400).send("Your OTP is Wrong");
    }
  } else {
    // OTP SIGNUP
    const otpHolder = await Otp.find({
      number: req.body.number,
    });
    if (otpHolder.length === 0)
      return res.status(400).send("You use an Expired OTP");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
      const user = new User({
        number: req.body.number,
        name: rightOtpFind.name,
      });
      const result = await user.save();
      const OTPDelete = await Otp.deleteMany({ number: rightOtpFind.number });
      return res.status(200).send({
        message: "User Registration Successfully",
        data: result,
        token: jwt.sign(
          { name: result.name, number: result.number, _id: result._id },
          "RESTFULAPIs"
        ),
      });
    } else {
      return res.status(400).send("Your OTP is Wrong");
    }
  }
};

module.exports.login = async (req, res) => {
  const password = req.body.password;
  const number = req.body.number;
  console.log(req.body);
  const checkNumber = await User.findOne({ number: number});
  console.log(checkNumber);
  if (checkNumber) {
    const checkPassword = await bcrypt.compare(password, checkNumber.password);
    if (checkPassword) {
        return res.status(200).send({
            message: "User login Successfully",
            data: checkNumber,
            token: jwt.sign(
              { name: checkNumber.name, number: checkNumber.number, _id: checkNumber._id },
              "RESTFULAPIs"
            ),
          });
        
    } else {
        return res.status(400).send({message:"Numéro de téléphone ou mot de passe incorrecte"});
        
    }
  } else {
    return res.status(400).send({message:"Numéro de téléphone ou mot de passe incorrecte" });
  }
};

module.exports.hello = async (req, res) => {
 
  return res.status(200).send({
    message: "Api Rest Genius vente"
  });
};


