import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { validateSchema } from "../utils/userValidater";

import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

interface signupUser {
  email: string;
  password: string;
  name: string;
  number:number
  longitude: number;
  latitude: number;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {error,value} = validateSchema.validate(req.body);
    if(error){
      throw new Error(error.details[0].message)
    }
    const { email, password, name, number, longitude, latitude } = value;
    
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      throw new Error("already exists");
    } 
      const user = new User({
        email: email,
        password: password,
        name: name,
        number: number,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      res.status(200).json(" user registered ");
    
  } catch (error) {
    res.status(500).json(`something went wrong ${error}`);
  }
};

//login controller
interface userLogin {
  email: string;
  password: string;
}
export const loginUser = async (req: Request, res: Response) => {
  try {
    const userdata: userLogin = req.body;
    const { email, password } = userdata;

    if (!email || !password) {
      throw new Error("email or password missing");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user not found");
    }
    if (user?.password) {
      const isPasswordTrue = await bcrypt.compare(password, user?.password);
      if (!isPasswordTrue) {
        throw new Error("password is incorrect");
      }
    }

    const token = jwt.sign({ user }, process.env.Secret_key as string, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json("ok");
  } catch (error) {
    res.status(503).json(error);
  }
};

//  get all nearByUsers
interface authenticateUser extends Request {
  user?: string | JwtPayload;
}
export const getNearbyUsers = async (req: authenticateUser, res: Response) => {
  try {
    const { radii } = req.body;

    const jsonObj = JSON.parse(JSON.stringify(req?.user));

    if (!jsonObj) {
      throw new Error(` location is empty`);
    }
    const longitude = jsonObj.user.location.coordinates[0];
    const latitude = jsonObj.user.location.coordinates[1];

    const users = await User.find({
      _id: { $ne: jsonObj.user._id },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radii * 1000, // 5 km
        },
      },
    }).select("name email number -_id");

    res.status(200).json(users);
  } catch (error) {
    res.status(501).json(error);
  }
};

// logout controller

export const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json("cookie cleared");
  } catch (error) {
    res.status(500).json(error);
  }
};
