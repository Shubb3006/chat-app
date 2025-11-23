import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "Email already exists, Try to Login" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exits, Try to signUP first" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt_token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Succesfully" });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(400).json({ message: "Profile Pic Required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const check = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server erorr" });
  }
};
