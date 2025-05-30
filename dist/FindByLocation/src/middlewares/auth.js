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
exports.isAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const auth = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!auth) {
            res.status(500).json("token is missing");
        }
        const token = auth === null || auth === void 0 ? void 0 : auth.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, "moja-hi-moja", (err, user) => {
                if (err) {
                    res.status(500).json("token is expired");
                }
                req.user = user;
                console.log(user);
                next();
            });
        }
    }
    catch (error) {
        res.status(501).json(error);
    }
});
exports.isAuthorized = isAuthorized;
