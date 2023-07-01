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
const node_http_1 = __importDefault(require("node:http"));
require("dotenv/config");
const controller_1 = require("./controller");
const PORT = process.env.PORT;
const server = node_http_1.default.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const controller = new controller_1.Controller;
    if (request.url === '/api/users' && request.method === 'GET') {
        const users = yield controller.getUsers();
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(users));
    }
    if (((_a = request.url) === null || _a === void 0 ? void 0 : _a.match(/^\/api\/users\/[^/]+$/)) && request.method === 'GET') {
        const id = request.url.split('/')[3];
        const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!UUIDPattern.test(id)) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'User id is invalid' }));
        }
        else {
            try {
                const user = yield controller.getUser(id);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(user));
            }
            catch (err) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'User not found' }));
            }
        }
    }
    if (request.url === '/api/users') {
        try {
            const data = yield getRequestData(request);
            if (JSON.parse(data)['username'] === undefined
                || JSON.parse(data)['age'] === undefined
                || JSON.parse(data)['hobbies'] === undefined
                || JSON.parse(data)['id'] !== undefined) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Invalid user object' }));
            }
            console.log(data);
            const user = yield controller.addUser(data);
            console.log(user);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(user));
        }
        catch (err) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: err }));
        }
    }
}));
server.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`);
});
function getRequestData(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            let reqBody = '';
            req.on('data', data => {
                reqBody += data;
            });
            req.on('end', () => resolve(reqBody));
        });
    });
}
