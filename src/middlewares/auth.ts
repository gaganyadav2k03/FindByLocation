import e, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { error } from "console";
dotenv.config({
  path: "../../.env",
});
interface authenticateUser extends Request {
  user?: string | JwtPayload;
}

export const isAuthorized = async (
  req: authenticateUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies.token;
    if (!token) {
      throw new Error(`token is missing`)
    }

    jwt.verify(
      token,
      process.env.Secret_key as string,
      (err: jwt.VerifyErrors | null, user: JwtPayload | string | undefined) => {
        if (err) {
          throw new Error("token is expired");
        }
        req.user = user as JwtPayload | string;

        next();
      }
    );
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};
