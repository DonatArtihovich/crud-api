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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const data_1 = require("./data");
const uuid_1 = require("uuid");
class Controller {
    constructor() { }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _) => {
                resolve(data_1.Users);
            });
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (id === undefined)
                    throw new Error('');
                const user = data_1.Users.find((user) => user.id === id);
                if (user === undefined)
                    reject();
                else
                    resolve(user);
            });
        });
    }
    addUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const user = JSON.parse(data);
                const id = (0, uuid_1.v4)();
                console.log(id);
                const userData = Object.assign({ id }, user);
                data_1.Users.push(userData);
                resolve(userData);
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const userIndex = data_1.Users.findIndex(user => user.id === id);
                if (userIndex === -1) {
                    reject();
                }
                else {
                    const requestData = JSON.parse(data);
                    const user = data_1.Users.find(user => user.id === id);
                    const updateData = {};
                    Object.entries(requestData).forEach((cur) => {
                        const key = cur[0];
                        const value = cur[1];
                        updateData[key] = {
                            value
                        };
                    });
                    Object.defineProperties(user, updateData);
                    resolve(user);
                }
            });
        });
    }
}
exports.Controller = Controller;
