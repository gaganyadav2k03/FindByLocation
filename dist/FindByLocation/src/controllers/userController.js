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
exports.getNearbyUsers = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, number, longitude, latitude } = req.body;
    try {
        const isExist = yield userModel_1.User.findOne({ email: email });
        if (isExist) {
            res.status(402).json("already exists");
        }
        const user = new userModel_1.User({
            email: email,
            password: password,
            name: name,
            number: number,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        user.password = yield bcryptjs_1.default.hash(user.password, 10);
        yield user.save();
        res.status(200).json(" user registered ");
    }
    catch (error) {
        throw new Error(`something went wrong ${error}`);
    }
});
exports.registerUser = registerUser;
//login controller
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(401).json("email or password missing");
        }
        const user = yield userModel_1.User.findOne({ email: email });
        if (!user) {
            res.status(401).json("user not found");
        }
        if (user === null || user === void 0 ? void 0 : user.password) {
            const isPasswordTrue = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (!isPasswordTrue) {
                res.status(500).json("password is incorrect");
            }
        }
        const token = jsonwebtoken_1.default.sign({ user }, "moja-hi-moja", { expiresIn: '1d' });
        res.status(200).json(token);
    }
    catch (error) {
        res.status(503).json(`something went wrong ${error}`);
    }
});
exports.loginUser = loginUser;
const getNearbyUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = req === null || req === void 0 ? void 0 : req.user;
        if (!location) {
            throw new Error(` location is empty`);
        }
        const longitude = location;
        const latitude = location;
        const users = yield userModel_1.User.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 5000, // 5 km
                },
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.getNearbyUsers = getNearbyUsers;
