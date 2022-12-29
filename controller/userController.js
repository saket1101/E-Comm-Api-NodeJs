const User = require("../models/userModel");
const {
  createToken,
  attachCookiesToRes,
  createTokenUser,
  checkPermission
} = require("../utilies/app");

module.exports.getAllUsers = async (req, res) => {
  try {
    // console.log(req.user)
    const users = await User.find({ role: "user" }).select("-password");
    if (users) {
      return res.status(201).json({ users: users });
    } else {
      return res.status(401).json("No user found");
    }
  } catch (error) {
    return res.status(501).json({ msg: "server error", error });
  }
};
module.exports.getSingleUser = async (req, res) => {
  try {
    // const { id } = req.params;
    // console.log(id)
    const user = await User.findOne({ _id: req.params.id}).select("-password");
    if (!user) {
      res.status(401).json(`no user found with this id : ${id}`);
      return;
    };
    // checkPermission(req.user,user._id)
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(501).json({msg:'Server error',Error:error.message});
    
  }
};
module.exports.showCurrentUser = async (req, res) => {
  try {
    return res.status(201).json({ user: req.user });
  } catch (error) {
    res.status(501).json("Server error", error);
  }
};
module.exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!email || !name) {
      return res.status(401).json("Wrong credentials");
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToRes({ res, user: tokenUser });
    res.status(201).json({ msg: "User updated successfully", User: tokenUser });
  } catch (error) {
    res.status(501).json({ msg: error.msg });
  }
};
module.exports.updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return res.status(401).json("plz provide both password");
    }
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json("Invalid credentail");
    }
    user.password = newPassword;
    await user.save();
    res.status(201).json({ msg: "Success! password successfully changed" });
  } catch (error) {}
};
