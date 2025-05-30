"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.getNearbyUsers = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userValidater_1 = require("../utils/userValidater");
dotenv_1.default.config({
    path: "./.env",
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = userValidater_1.validateSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const { email, password, name, number, longitude, latitude } = value;
        const isExist = yield userModel_1.User.findOne({ email: email });
        if (isExist) {
            throw new Error("already exists");
        }
        const user = new userModel_1.User({
            email: email,
            password: password,
            name: name,
            number: number,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
        });
        user.password = yield bcryptjs_1.default.hash(user.password, 10);
        yield user.save();
        res.status(200).json(" user registered ");
    }
    catch (error) {
        res.status(500).json(`something went wrong ${error}`);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = req.body;
        const { email, password } = userdata;
        if (!email || !password) {
            throw new Error("email or password missing");
        }
        const user = yield userModel_1.User.findOne({ email: email });
        if (!user) {
            throw new Error("user not found");
        }
        if (user === null || user === void 0 ? void 0 : user.password) {
            const isPasswordTrue = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (!isPasswordTrue) {
                throw new Error("password is incorrect");
            }
        }
        const token = jsonwebtoken_1.default.sign({ user }, process.env.Secret_key, {
            expiresIn: "1d",
        });
        res
            .cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
            .status(200)
            .json("ok");
    }
    catch (error) {
        res.status(503).json(error);
    }
});
exports.loginUser = loginUser;
const getNearbyUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { radii } = req.body;
        const jsonObj = JSON.parse(JSON.stringify(req === null || req === void 0 ? void 0 : req.user));
        if (!jsonObj) {
            throw new Error(` location is empty`);
        }
        const longitude = jsonObj.user.location.coordinates[0];
        const latitude = jsonObj.user.location.coordinates[1];
        const users = yield userModel_1.User.find({
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
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.getNearbyUsers = getNearbyUsers;
// logout controller
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.status(200).json("cookie cleared");
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.logOut = logOut;
