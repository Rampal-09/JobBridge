import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        msg: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        msg: "User not found",
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.log("auth error", err);

    return res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};

export const role = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "resticted" });
    }
    next();
  };
};
