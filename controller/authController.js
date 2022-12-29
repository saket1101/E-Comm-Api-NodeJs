const User = require("../models/userModel");
const {
  attachCookiesToRes,
  createToken,
  createTokenUser,
} = require("../utilies/app");

module.exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(401).json("plz fill all the inputs");
    }
    const emailFound = await User.findOne({ email: email });
    if (emailFound) {
      return res.status(401).json("Your email already exist Plz login!");
    }
    // first registerd account is admin after that all is user

    const firstAccount = (await User.countDocuments({})) === 0;
    const role = firstAccount ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    // token
    const tokenUser = createTokenUser(user);
    // const token = createToken({payload:tokenUser});
    attachCookiesToRes({ res, user: tokenUser });
    res
      .status(200)
      .json({ msg: "Email registered successfully", User: tokenUser });
  } catch (error) {
    res.status(501).json({ msg: error.msg });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json("plz provide email or password");
    }
    const user = await User.findOne({ email: email });
    // console.log(user)
    if (user) {
      const isPasswordMatch = await user.comparePassword(password);
      if (isPasswordMatch) {
        const tokenUser = createTokenUser(user);
        attachCookiesToRes({ res, user: tokenUser });
        res.status(200).json({ msg: "login successfull", user:user.name,
        email:user.email,role:user.role });
      } else {
        return res.status(401).json("password does not matched");
      }
    } else {
      return res.status(401).json("No user found plz register!");
    }
  } catch (error) {
    res.status(501).json({ msg: error.msg });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      exprires: new Date(Date.now()),
    });
    res.status(200).json("User logout successfully");
  } catch (error) {
    res.status(501).json({ msg: error.msg });
  }
};
