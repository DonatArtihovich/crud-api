/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/dotenv/config.js":
/*!***************************************!*\
  !*** ./node_modules/dotenv/config.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("(function () {\n  (__webpack_require__(/*! ./lib/main */ \"./node_modules/dotenv/lib/main.js\").config)(\n    Object.assign(\n      {},\n      __webpack_require__(/*! ./lib/env-options */ \"./node_modules/dotenv/lib/env-options.js\"),\n      __webpack_require__(/*! ./lib/cli-options */ \"./node_modules/dotenv/lib/cli-options.js\")(process.argv)\n    )\n  )\n})()\n\n\n//# sourceURL=webpack:///./node_modules/dotenv/config.js?");

/***/ }),

/***/ "./node_modules/dotenv/lib/cli-options.js":
/*!************************************************!*\
  !*** ./node_modules/dotenv/lib/cli-options.js ***!
  \************************************************/
/***/ ((module) => {

eval("const re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/\n\nmodule.exports = function optionMatcher (args) {\n  return args.reduce(function (acc, cur) {\n    const matches = cur.match(re)\n    if (matches) {\n      acc[matches[1]] = matches[2]\n    }\n    return acc\n  }, {})\n}\n\n\n//# sourceURL=webpack:///./node_modules/dotenv/lib/cli-options.js?");

/***/ }),

/***/ "./node_modules/dotenv/lib/env-options.js":
/*!************************************************!*\
  !*** ./node_modules/dotenv/lib/env-options.js ***!
  \************************************************/
/***/ ((module) => {

eval("// ../config.js accepts options via environment variables\nconst options = {}\n\nif (process.env.DOTENV_CONFIG_ENCODING != null) {\n  options.encoding = process.env.DOTENV_CONFIG_ENCODING\n}\n\nif (process.env.DOTENV_CONFIG_PATH != null) {\n  options.path = process.env.DOTENV_CONFIG_PATH\n}\n\nif (process.env.DOTENV_CONFIG_DEBUG != null) {\n  options.debug = process.env.DOTENV_CONFIG_DEBUG\n}\n\nif (process.env.DOTENV_CONFIG_OVERRIDE != null) {\n  options.override = process.env.DOTENV_CONFIG_OVERRIDE\n}\n\nif (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {\n  options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY\n}\n\nmodule.exports = options\n\n\n//# sourceURL=webpack:///./node_modules/dotenv/lib/env-options.js?");

/***/ }),

/***/ "./node_modules/dotenv/lib/main.js":
/*!*****************************************!*\
  !*** ./node_modules/dotenv/lib/main.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\")\nconst path = __webpack_require__(/*! path */ \"path\")\nconst os = __webpack_require__(/*! os */ \"os\")\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\nconst packageJson = __webpack_require__(/*! ../package.json */ \"./node_modules/dotenv/package.json\")\n\nconst version = packageJson.version\n\nconst LINE = /(?:^|^)\\s*(?:export\\s+)?([\\w.-]+)(?:\\s*=\\s*?|:\\s+?)(\\s*'(?:\\\\'|[^'])*'|\\s*\"(?:\\\\\"|[^\"])*\"|\\s*`(?:\\\\`|[^`])*`|[^#\\r\\n]+)?\\s*(?:#.*)?(?:$|$)/mg\n\n// Parse src into an Object\nfunction parse (src) {\n  const obj = {}\n\n  // Convert buffer to string\n  let lines = src.toString()\n\n  // Convert line breaks to same format\n  lines = lines.replace(/\\r\\n?/mg, '\\n')\n\n  let match\n  while ((match = LINE.exec(lines)) != null) {\n    const key = match[1]\n\n    // Default undefined or null to empty string\n    let value = (match[2] || '')\n\n    // Remove whitespace\n    value = value.trim()\n\n    // Check if double quoted\n    const maybeQuote = value[0]\n\n    // Remove surrounding quotes\n    value = value.replace(/^(['\"`])([\\s\\S]*)\\1$/mg, '$2')\n\n    // Expand newlines if double quoted\n    if (maybeQuote === '\"') {\n      value = value.replace(/\\\\n/g, '\\n')\n      value = value.replace(/\\\\r/g, '\\r')\n    }\n\n    // Add to object\n    obj[key] = value\n  }\n\n  return obj\n}\n\nfunction _parseVault (options) {\n  const vaultPath = _vaultPath(options)\n\n  // Parse .env.vault\n  const result = DotenvModule.configDotenv({ path: vaultPath })\n  if (!result.parsed) {\n    throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)\n  }\n\n  // handle scenario for comma separated keys - for use with key rotation\n  // example: DOTENV_KEY=\"dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenv.org/vault/.env.vault?environment=prod\"\n  const keys = _dotenvKey(options).split(',')\n  const length = keys.length\n\n  let decrypted\n  for (let i = 0; i < length; i++) {\n    try {\n      // Get full key\n      const key = keys[i].trim()\n\n      // Get instructions for decrypt\n      const attrs = _instructions(result, key)\n\n      // Decrypt\n      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)\n\n      break\n    } catch (error) {\n      // last key\n      if (i + 1 >= length) {\n        throw error\n      }\n      // try next key\n    }\n  }\n\n  // Parse decrypted .env string\n  return DotenvModule.parse(decrypted)\n}\n\nfunction _log (message) {\n  console.log(`[dotenv@${version}][INFO] ${message}`)\n}\n\nfunction _warn (message) {\n  console.log(`[dotenv@${version}][WARN] ${message}`)\n}\n\nfunction _debug (message) {\n  console.log(`[dotenv@${version}][DEBUG] ${message}`)\n}\n\nfunction _dotenvKey (options) {\n  // prioritize developer directly setting options.DOTENV_KEY\n  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {\n    return options.DOTENV_KEY\n  }\n\n  // secondary infra already contains a DOTENV_KEY environment variable\n  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {\n    return process.env.DOTENV_KEY\n  }\n\n  // fallback to empty string\n  return ''\n}\n\nfunction _instructions (result, dotenvKey) {\n  // Parse DOTENV_KEY. Format is a URI\n  let uri\n  try {\n    uri = new URL(dotenvKey)\n  } catch (error) {\n    if (error.code === 'ERR_INVALID_URL') {\n      throw new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development')\n    }\n\n    throw error\n  }\n\n  // Get decrypt key\n  const key = uri.password\n  if (!key) {\n    throw new Error('INVALID_DOTENV_KEY: Missing key part')\n  }\n\n  // Get environment\n  const environment = uri.searchParams.get('environment')\n  if (!environment) {\n    throw new Error('INVALID_DOTENV_KEY: Missing environment part')\n  }\n\n  // Get ciphertext payload\n  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`\n  const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION\n  if (!ciphertext) {\n    throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`)\n  }\n\n  return { ciphertext, key }\n}\n\nfunction _vaultPath (options) {\n  let dotenvPath = path.resolve(process.cwd(), '.env')\n\n  if (options && options.path && options.path.length > 0) {\n    dotenvPath = options.path\n  }\n\n  // Locate .env.vault\n  return dotenvPath.endsWith('.vault') ? dotenvPath : `${dotenvPath}.vault`\n}\n\nfunction _resolveHome (envPath) {\n  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath\n}\n\nfunction _configVault (options) {\n  _log('Loading env from encrypted .env.vault')\n\n  const parsed = DotenvModule._parseVault(options)\n\n  let processEnv = process.env\n  if (options && options.processEnv != null) {\n    processEnv = options.processEnv\n  }\n\n  DotenvModule.populate(processEnv, parsed, options)\n\n  return { parsed }\n}\n\nfunction configDotenv (options) {\n  let dotenvPath = path.resolve(process.cwd(), '.env')\n  let encoding = 'utf8'\n  const debug = Boolean(options && options.debug)\n\n  if (options) {\n    if (options.path != null) {\n      dotenvPath = _resolveHome(options.path)\n    }\n    if (options.encoding != null) {\n      encoding = options.encoding\n    }\n  }\n\n  try {\n    // Specifying an encoding returns a string instead of a buffer\n    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))\n\n    let processEnv = process.env\n    if (options && options.processEnv != null) {\n      processEnv = options.processEnv\n    }\n\n    DotenvModule.populate(processEnv, parsed, options)\n\n    return { parsed }\n  } catch (e) {\n    if (debug) {\n      _debug(`Failed to load ${dotenvPath} ${e.message}`)\n    }\n\n    return { error: e }\n  }\n}\n\n// Populates process.env from .env file\nfunction config (options) {\n  const vaultPath = _vaultPath(options)\n\n  // fallback to original dotenv if DOTENV_KEY is not set\n  if (_dotenvKey(options).length === 0) {\n    return DotenvModule.configDotenv(options)\n  }\n\n  // dotenvKey exists but .env.vault file does not exist\n  if (!fs.existsSync(vaultPath)) {\n    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`)\n\n    return DotenvModule.configDotenv(options)\n  }\n\n  return DotenvModule._configVault(options)\n}\n\nfunction decrypt (encrypted, keyStr) {\n  const key = Buffer.from(keyStr.slice(-64), 'hex')\n  let ciphertext = Buffer.from(encrypted, 'base64')\n\n  const nonce = ciphertext.slice(0, 12)\n  const authTag = ciphertext.slice(-16)\n  ciphertext = ciphertext.slice(12, -16)\n\n  try {\n    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)\n    aesgcm.setAuthTag(authTag)\n    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`\n  } catch (error) {\n    const isRange = error instanceof RangeError\n    const invalidKeyLength = error.message === 'Invalid key length'\n    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'\n\n    if (isRange || invalidKeyLength) {\n      const msg = 'INVALID_DOTENV_KEY: It must be 64 characters long (or more)'\n      throw new Error(msg)\n    } else if (decryptionFailed) {\n      const msg = 'DECRYPTION_FAILED: Please check your DOTENV_KEY'\n      throw new Error(msg)\n    } else {\n      console.error('Error: ', error.code)\n      console.error('Error: ', error.message)\n      throw error\n    }\n  }\n}\n\n// Populate process.env with parsed values\nfunction populate (processEnv, parsed, options = {}) {\n  const debug = Boolean(options && options.debug)\n  const override = Boolean(options && options.override)\n\n  if (typeof parsed !== 'object') {\n    throw new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')\n  }\n\n  // Set process.env\n  for (const key of Object.keys(parsed)) {\n    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {\n      if (override === true) {\n        processEnv[key] = parsed[key]\n      }\n\n      if (debug) {\n        if (override === true) {\n          _debug(`\"${key}\" is already defined and WAS overwritten`)\n        } else {\n          _debug(`\"${key}\" is already defined and was NOT overwritten`)\n        }\n      }\n    } else {\n      processEnv[key] = parsed[key]\n    }\n  }\n}\n\nconst DotenvModule = {\n  configDotenv,\n  _configVault,\n  _parseVault,\n  config,\n  decrypt,\n  parse,\n  populate\n}\n\nmodule.exports.configDotenv = DotenvModule.configDotenv\nmodule.exports._configVault = DotenvModule._configVault\nmodule.exports._parseVault = DotenvModule._parseVault\nmodule.exports.config = DotenvModule.config\nmodule.exports.decrypt = DotenvModule.decrypt\nmodule.exports.parse = DotenvModule.parse\nmodule.exports.populate = DotenvModule.populate\n\nmodule.exports = DotenvModule\n\n\n//# sourceURL=webpack:///./node_modules/dotenv/lib/main.js?");

/***/ }),

/***/ "./src/cluster.ts":
/*!************************!*\
  !*** ./src/cluster.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst node_os_1 = __importDefault(__webpack_require__(/*! node:os */ \"node:os\"));\nconst cluster_1 = __importDefault(__webpack_require__(/*! cluster */ \"cluster\"));\nconst node_http_1 = __importDefault(__webpack_require__(/*! node:http */ \"node:http\"));\n__webpack_require__(/*! dotenv/config */ \"./node_modules/dotenv/config.js\");\nconst controller_1 = __webpack_require__(/*! ./controller */ \"./src/controller.ts\");\nconst PORT = process.env.PORT;\nif (cluster_1.default.isPrimary) {\n    const CPUSnum = node_os_1.default.cpus().length;\n    for (let i = 0; i < CPUSnum - 1; i++) {\n        const port = +PORT + i;\n        const worker = cluster_1.default.fork();\n        worker.send({ port });\n    }\n}\nelse {\n    const server = node_http_1.default.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {\n        var _a, _b, _c;\n        const controller = new controller_1.Controller;\n        if (request.url === '/api/users' && request.method === 'GET') {\n            const users = yield controller.getUsers();\n            response.writeHead(200, { \"Content-Type\": \"application/json\" });\n            response.end(JSON.stringify(users));\n        }\n        else if (((_a = request.url) === null || _a === void 0 ? void 0 : _a.match(/^\\/api\\/users\\/[^/]+$/)) && request.method === 'GET') {\n            const id = request.url.split('/')[3];\n            const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;\n            if (!UUIDPattern.test(id)) {\n                response.writeHead(400, { 'Content-Type': 'application/json' });\n                response.end(JSON.stringify({ message: 'User id is invalid' }));\n            }\n            else {\n                try {\n                    const user = yield controller.getUser(id);\n                    response.writeHead(200, { 'Content-Type': 'application/json' });\n                    response.end(JSON.stringify(user));\n                }\n                catch (err) {\n                    if (err instanceof Error) {\n                        if (err.message === 'Not Founded') {\n                            response.writeHead(404, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'User not found' }));\n                        }\n                        else {\n                            response.writeHead(500, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'Unexpected server error' }));\n                        }\n                    }\n                }\n            }\n        }\n        else if (request.url === '/api/users' && request.method === 'POST') {\n            try {\n                const data = yield getRequestData(request);\n                if (isValidUser(JSON.parse(data))) {\n                    response.writeHead(400, { 'Content-Type': 'application/json' });\n                    response.end(JSON.stringify({ message: 'Invalid user object' }));\n                }\n                const user = yield controller.addUser(data);\n                response.writeHead(201, { 'Content-Type': 'application/json' });\n                response.end(JSON.stringify(user));\n            }\n            catch (err) {\n                if (err instanceof Error) {\n                    if (err.message === 'Not Founded') {\n                        response.writeHead(404, { 'Content-Type': 'application/json' });\n                        response.end(JSON.stringify({ message: 'User not found' }));\n                    }\n                    else {\n                        response.writeHead(500, { 'Content-Type': 'application/json' });\n                        response.end(JSON.stringify({ message: 'Unexpected server error' }));\n                    }\n                }\n            }\n        }\n        else if (((_b = request.url) === null || _b === void 0 ? void 0 : _b.match(/^\\/api\\/users\\/[^/]+$/)) && request.method === 'PUT') {\n            const id = request.url.split('/')[3];\n            const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;\n            if (!UUIDPattern.test(id)) {\n                response.writeHead(400, { 'Content-Type': 'application/json' });\n                response.end(JSON.stringify({ message: 'User id is invalid' }));\n            }\n            else {\n                try {\n                    const data = yield getRequestData(request);\n                    const user = yield controller.updateUser(id, data);\n                    response.writeHead(200, { 'Content-Type': 'application/json' });\n                    response.end(JSON.stringify(user));\n                }\n                catch (err) {\n                    if (err instanceof Error) {\n                        if (err.message === 'Not Founded') {\n                            response.writeHead(404, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'User not found' }));\n                        }\n                        else {\n                            response.writeHead(500, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'Unexpected server error' }));\n                        }\n                    }\n                }\n            }\n        }\n        else if (((_c = request.url) === null || _c === void 0 ? void 0 : _c.match(/^\\/api\\/users\\/[^/]+$/)) && request.method === 'DELETE') {\n            const id = request.url.split('/')[3];\n            const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;\n            if (!UUIDPattern.test(id)) {\n                response.writeHead(400, { 'Content-Type': 'application/json' });\n                response.end(JSON.stringify({ message: 'User id is invalid' }));\n            }\n            else {\n                try {\n                    yield controller.deleteUser(id);\n                    response.writeHead(204, { 'Content-Type': 'application/json' });\n                    response.end();\n                }\n                catch (err) {\n                    if (err instanceof Error) {\n                        if (err.message === 'Not Founded') {\n                            response.writeHead(404, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'User not found' }));\n                        }\n                        else {\n                            response.writeHead(500, { 'Content-Type': 'application/json' });\n                            response.end(JSON.stringify({ message: 'Unexpected server error' }));\n                        }\n                    }\n                }\n            }\n        }\n        else {\n            response.writeHead(404, { 'Content-Type': 'application/json' });\n            response.end(JSON.stringify({ message: 'Resource not found' }));\n        }\n    }));\n    process.on('message', (params) => {\n        const port = params.port;\n        server.listen(port, () => {\n            console.log(`Server is started on port ${port}`);\n        });\n    });\n}\nfunction getRequestData(req) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return new Promise(resolve => {\n            let reqBody = '';\n            req.on('data', data => {\n                reqBody += data;\n            });\n            req.on('end', () => resolve(reqBody));\n        });\n    });\n}\nfunction isValidUser(user) {\n    return (typeof user.username === 'string' &&\n        typeof user.age === 'number' &&\n        Array.isArray(user) &&\n        user.hobbies.every(h => typeof h === 'string'));\n}\n\n\n//# sourceURL=webpack:///./src/cluster.ts?");

/***/ }),

/***/ "./src/controller.ts":
/*!***************************!*\
  !*** ./src/controller.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Controller = void 0;\nconst data_1 = __webpack_require__(/*! ./data */ \"./src/data.ts\");\nconst uuid_1 = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-node/index.js\");\nclass Controller {\n    getUsers() {\n        return __awaiter(this, void 0, void 0, function* () {\n            return new Promise((resolve, reject) => {\n                if (data_1.Users)\n                    resolve(data_1.Users);\n                else\n                    reject(new Error('Not Founded'));\n            });\n        });\n    }\n    getUser(id) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return new Promise((resolve, reject) => {\n                if (id === undefined)\n                    throw new Error('');\n                const user = data_1.Users.find((user) => user.id === id);\n                if (user === undefined)\n                    reject(new Error('Not Founded'));\n                else\n                    resolve(user);\n            });\n        });\n    }\n    addUser(data) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return new Promise(resolve => {\n                const user = JSON.parse(data);\n                const id = (0, uuid_1.v4)();\n                const userData = Object.assign({ id }, user);\n                data_1.Users.push(userData);\n                resolve(userData);\n            });\n        });\n    }\n    updateUser(id, data) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return new Promise((resolve, reject) => {\n                const userIndex = data_1.Users.findIndex(user => user.id === id);\n                if (userIndex === -1) {\n                    reject(new Error('Not Founded'));\n                }\n                else {\n                    const requestData = JSON.parse(data);\n                    const user = data_1.Users.find(user => user.id === id);\n                    const updateData = {};\n                    Object.entries(requestData).forEach((cur) => {\n                        const key = cur[0];\n                        const value = cur[1];\n                        updateData[key] = {\n                            value\n                        };\n                    });\n                    Object.defineProperties(user, updateData);\n                    resolve(user);\n                }\n            });\n        });\n    }\n    deleteUser(id) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return new Promise((resolve, reject) => {\n                const userIndex = data_1.Users.findIndex(user => user.id === id);\n                if (userIndex === -1)\n                    reject(new Error('Not Founded'));\n                else {\n                    data_1.Users.splice(userIndex);\n                    resolve(data_1.Users);\n                }\n            });\n        });\n    }\n}\nexports.Controller = Controller;\n\n\n//# sourceURL=webpack:///./src/controller.ts?");

/***/ }),

/***/ "./src/data.ts":
/*!*********************!*\
  !*** ./src/data.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Users = void 0;\nexports.Users = [\n    {\n        id: '144ea26f-a8be-4d8c-a9f6-d8a8493f5dc0',\n        username: 'Sara',\n        age: 17,\n        hobbies: ['progging', 'gaming']\n    }\n];\n\n\n//# sourceURL=webpack:///./src/data.ts?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/index.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NIL: () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n/* harmony export */   parse: () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"]),\n/* harmony export */   stringify: () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"]),\n/* harmony export */   v1: () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   v3: () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   v4: () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   v5: () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n/* harmony export */   validate: () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"]),\n/* harmony export */   version: () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ \"./node_modules/uuid/dist/esm-node/v1.js\");\n/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ \"./node_modules/uuid/dist/esm-node/v3.js\");\n/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ \"./node_modules/uuid/dist/esm-node/v4.js\");\n/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ \"./node_modules/uuid/dist/esm-node/v5.js\");\n/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ \"./node_modules/uuid/dist/esm-node/nil.js\");\n/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ \"./node_modules/uuid/dist/esm-node/version.js\");\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-node/validate.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-node/stringify.js\");\n/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ \"./node_modules/uuid/dist/esm-node/parse.js\");\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/index.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/md5.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/md5.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction md5(bytes) {\n  if (Array.isArray(bytes)) {\n    bytes = Buffer.from(bytes);\n  } else if (typeof bytes === 'string') {\n    bytes = Buffer.from(bytes, 'utf8');\n  }\n\n  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('md5').update(bytes).digest();\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/md5.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/native.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/native.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  randomUUID: (crypto__WEBPACK_IMPORTED_MODULE_0___default().randomUUID)\n});\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/native.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/nil.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/nil.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/nil.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/parse.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/parse.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-node/validate.js\");\n\n\nfunction parse(uuid) {\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Invalid UUID');\n  }\n\n  let v;\n  const arr = new Uint8Array(16); // Parse ########-....-....-....-............\n\n  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;\n  arr[1] = v >>> 16 & 0xff;\n  arr[2] = v >>> 8 & 0xff;\n  arr[3] = v & 0xff; // Parse ........-####-....-....-............\n\n  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;\n  arr[5] = v & 0xff; // Parse ........-....-####-....-............\n\n  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;\n  arr[7] = v & 0xff; // Parse ........-....-....-####-............\n\n  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;\n  arr[9] = v & 0xff; // Parse ........-....-....-....-############\n  // (Use \"/\" to avoid 32-bit truncation when bit-shifting high-order bytes)\n\n  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;\n  arr[11] = v / 0x100000000 & 0xff;\n  arr[12] = v >>> 24 & 0xff;\n  arr[13] = v >>> 16 & 0xff;\n  arr[14] = v >>> 8 & 0xff;\n  arr[15] = v & 0xff;\n  return arr;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/parse.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/regex.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/regex.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/rng.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/rng.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rng)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\nconst rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate\n\nlet poolPtr = rnds8Pool.length;\nfunction rng() {\n  if (poolPtr > rnds8Pool.length - 16) {\n    crypto__WEBPACK_IMPORTED_MODULE_0___default().randomFillSync(rnds8Pool);\n    poolPtr = 0;\n  }\n\n  return rnds8Pool.slice(poolPtr, poolPtr += 16);\n}\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/sha1.js":
/*!*************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/sha1.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction sha1(bytes) {\n  if (Array.isArray(bytes)) {\n    bytes = Buffer.from(bytes);\n  } else if (typeof bytes === 'string') {\n    bytes = Buffer.from(bytes, 'utf8');\n  }\n\n  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('sha1').update(bytes).digest();\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/sha1.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/stringify.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/stringify.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-node/validate.js\");\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\n\nconst byteToHex = [];\n\nfor (let i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).slice(1));\n}\n\nfunction unsafeStringify(arr, offset = 0) {\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();\n}\n\nfunction stringify(arr, offset = 0) {\n  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n\n  return uuid;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v1.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v1.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-node/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-node/stringify.js\");\n\n // **`v1()` - Generate time-based UUID**\n//\n// Inspired by https://github.com/LiosK/UUID.js\n// and http://docs.python.org/library/uuid.html\n\nlet _nodeId;\n\nlet _clockseq; // Previous uuid creation time\n\n\nlet _lastMSecs = 0;\nlet _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details\n\nfunction v1(options, buf, offset) {\n  let i = buf && offset || 0;\n  const b = buf || new Array(16);\n  options = options || {};\n  let node = options.node || _nodeId;\n  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not\n  // specified.  We do this lazily to minimize issues related to insufficient\n  // system entropy.  See #189\n\n  if (node == null || clockseq == null) {\n    const seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n\n    if (node == null) {\n      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)\n      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];\n    }\n\n    if (clockseq == null) {\n      // Per 4.2.2, randomize (14 bit) clockseq\n      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;\n    }\n  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,\n  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so\n  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'\n  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.\n\n\n  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock\n  // cycle to simulate higher resolution clock\n\n  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)\n\n  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression\n\n  if (dt < 0 && options.clockseq === undefined) {\n    clockseq = clockseq + 1 & 0x3fff;\n  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new\n  // time interval\n\n\n  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {\n    nsecs = 0;\n  } // Per 4.2.1.2 Throw error if too many uuids are requested\n\n\n  if (nsecs >= 10000) {\n    throw new Error(\"uuid.v1(): Can't create more than 10M uuids/sec\");\n  }\n\n  _lastMSecs = msecs;\n  _lastNSecs = nsecs;\n  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch\n\n  msecs += 12219292800000; // `time_low`\n\n  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;\n  b[i++] = tl >>> 24 & 0xff;\n  b[i++] = tl >>> 16 & 0xff;\n  b[i++] = tl >>> 8 & 0xff;\n  b[i++] = tl & 0xff; // `time_mid`\n\n  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;\n  b[i++] = tmh >>> 8 & 0xff;\n  b[i++] = tmh & 0xff; // `time_high_and_version`\n\n  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version\n\n  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)\n\n  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`\n\n  b[i++] = clockseq & 0xff; // `node`\n\n  for (let n = 0; n < 6; ++n) {\n    b[i + n] = node[n];\n  }\n\n  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(b);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/v1.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v3.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v3.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ \"./node_modules/uuid/dist/esm-node/v35.js\");\n/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ \"./node_modules/uuid/dist/esm-node/md5.js\");\n\n\nconst v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/v3.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v35.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v35.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DNS: () => (/* binding */ DNS),\n/* harmony export */   URL: () => (/* binding */ URL),\n/* harmony export */   \"default\": () => (/* binding */ v35)\n/* harmony export */ });\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-node/stringify.js\");\n/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ \"./node_modules/uuid/dist/esm-node/parse.js\");\n\n\n\nfunction stringToBytes(str) {\n  str = unescape(encodeURIComponent(str)); // UTF8 escape\n\n  const bytes = [];\n\n  for (let i = 0; i < str.length; ++i) {\n    bytes.push(str.charCodeAt(i));\n  }\n\n  return bytes;\n}\n\nconst DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';\nconst URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';\nfunction v35(name, version, hashfunc) {\n  function generateUUID(value, namespace, buf, offset) {\n    var _namespace;\n\n    if (typeof value === 'string') {\n      value = stringToBytes(value);\n    }\n\n    if (typeof namespace === 'string') {\n      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(namespace);\n    }\n\n    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {\n      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');\n    } // Compute hash of namespace and value, Per 4.3\n    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =\n    // hashfunc([...namespace, ... value])`\n\n\n    let bytes = new Uint8Array(16 + value.length);\n    bytes.set(namespace);\n    bytes.set(value, namespace.length);\n    bytes = hashfunc(bytes);\n    bytes[6] = bytes[6] & 0x0f | version;\n    bytes[8] = bytes[8] & 0x3f | 0x80;\n\n    if (buf) {\n      offset = offset || 0;\n\n      for (let i = 0; i < 16; ++i) {\n        buf[offset + i] = bytes[i];\n      }\n\n      return buf;\n    }\n\n    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.unsafeStringify)(bytes);\n  } // Function#name is not settable on some platforms (#270)\n\n\n  try {\n    generateUUID.name = name; // eslint-disable-next-line no-empty\n  } catch (err) {} // For CommonJS default export support\n\n\n  generateUUID.DNS = DNS;\n  generateUUID.URL = URL;\n  return generateUUID;\n}\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/v35.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v4.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v4.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ \"./node_modules/uuid/dist/esm-node/native.js\");\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-node/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-node/stringify.js\");\n\n\n\n\nfunction v4(options, buf, offset) {\n  if (_native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID && !buf && !options) {\n    return _native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID();\n  }\n\n  options = options || {};\n  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided\n\n  if (buf) {\n    offset = offset || 0;\n\n    for (let i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n\n    return buf;\n  }\n\n  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v5.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v5.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ \"./node_modules/uuid/dist/esm-node/v35.js\");\n/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ \"./node_modules/uuid/dist/esm-node/sha1.js\");\n\n\nconst v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/v5.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/validate.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/validate.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/esm-node/regex.js\");\n\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].test(uuid);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/validate.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/version.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/version.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-node/validate.js\");\n\n\nfunction version(uuid) {\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Invalid UUID');\n  }\n\n  return parseInt(uuid.slice(14, 15), 16);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);\n\n//# sourceURL=webpack:///./node_modules/uuid/dist/esm-node/version.js?");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("cluster");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:os":
/*!**************************!*\
  !*** external "node:os" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "./node_modules/dotenv/package.json":
/*!******************************************!*\
  !*** ./node_modules/dotenv/package.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"name\":\"dotenv\",\"version\":\"16.3.1\",\"description\":\"Loads environment variables from .env file\",\"main\":\"lib/main.js\",\"types\":\"lib/main.d.ts\",\"exports\":{\".\":{\"types\":\"./lib/main.d.ts\",\"require\":\"./lib/main.js\",\"default\":\"./lib/main.js\"},\"./config\":\"./config.js\",\"./config.js\":\"./config.js\",\"./lib/env-options\":\"./lib/env-options.js\",\"./lib/env-options.js\":\"./lib/env-options.js\",\"./lib/cli-options\":\"./lib/cli-options.js\",\"./lib/cli-options.js\":\"./lib/cli-options.js\",\"./package.json\":\"./package.json\"},\"scripts\":{\"dts-check\":\"tsc --project tests/types/tsconfig.json\",\"lint\":\"standard\",\"lint-readme\":\"standard-markdown\",\"pretest\":\"npm run lint && npm run dts-check\",\"test\":\"tap tests/*.js --100 -Rspec\",\"prerelease\":\"npm test\",\"release\":\"standard-version\"},\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/motdotla/dotenv.git\"},\"funding\":\"https://github.com/motdotla/dotenv?sponsor=1\",\"keywords\":[\"dotenv\",\"env\",\".env\",\"environment\",\"variables\",\"config\",\"settings\"],\"readmeFilename\":\"README.md\",\"license\":\"BSD-2-Clause\",\"devDependencies\":{\"@definitelytyped/dtslint\":\"^0.0.133\",\"@types/node\":\"^18.11.3\",\"decache\":\"^4.6.1\",\"sinon\":\"^14.0.1\",\"standard\":\"^17.0.0\",\"standard-markdown\":\"^7.1.0\",\"standard-version\":\"^9.5.0\",\"tap\":\"^16.3.0\",\"tar\":\"^6.1.11\",\"typescript\":\"^4.8.4\"},\"engines\":{\"node\":\">=12\"},\"browser\":{\"fs\":false}}');\n\n//# sourceURL=webpack:///./node_modules/dotenv/package.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/cluster.ts");
/******/ 	
/******/ })()
;