import bcrypt from "bcryptjs";
import Users from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeTemplate } from "../templates/index.js";

export const register = async (req, res) => {
  console.log("req came to auth controller");
  try {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role, req.body);

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        msg: "Please fill all fields",
      });
    }

    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const normalizedEmail = email.toLowerCase();
    const hashpassword = await bcrypt.hash(password, 12);

    const newUser = await Users.create({
      name: name,
      email: normalizedEmail,
      password: hashpassword,
      role: role,
    });

    // Automatically create a default profile for the user
    await profileModel.create({ userId: newUser._id });

    // Send Welcome Email (non-blocking)
    sendEmail({
      to: newUser.email,
      subject: "Welcome to JobBridge! 🎉",
      html: welcomeTemplate({ name: newUser.name }),
    }).catch((err) => {
      console.error("Welcome email failed to send:", err.message);
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        msg: "Registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    console.log(err.name);
    console.log(err.stack);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ msg: "enter email and password both" });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "email or password is incorrect" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({ msg: "email or password is incorrect" });
    }

    const token = jwt.sign(
      {
        id: user._id,

        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,

        sameSite: "strict",

        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        msg: "login successfully",
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      msg: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
