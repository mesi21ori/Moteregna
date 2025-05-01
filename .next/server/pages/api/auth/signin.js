"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/signin";
exports.ids = ["pages/api/auth/signin"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookie":
/*!*************************!*\
  !*** external "cookie" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("cookie");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = import("uuid");;

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/***/ ((module) => {

module.exports = import("zod");;

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Fsignin&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5Csignin.ts&middlewareConfigBase64=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Fsignin&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5Csignin.ts&middlewareConfigBase64=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src\\pages\\api\\auth\\signin.ts */ \"(api)/./src/pages/api/auth/signin.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__]);\n_src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/signin\",\n        pathname: \"/api/auth/signin\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _src_pages_api_auth_signin_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmF1dGglMkZzaWduaW4mcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZzcmMlNUNwYWdlcyU1Q2FwaSU1Q2F1dGglNUNzaWduaW4udHMmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ0w7QUFDMUQ7QUFDK0Q7QUFDL0Q7QUFDQSxpRUFBZSx3RUFBSyxDQUFDLDBEQUFRLFlBQVksRUFBQztBQUMxQztBQUNPLGVBQWUsd0VBQUssQ0FBQywwREFBUTtBQUNwQztBQUNPLHdCQUF3QixnSEFBbUI7QUFDbEQ7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWTtBQUNaLENBQUM7O0FBRUQscUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb3RlcmVnbmEtYXBpLz83MmU3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzQVBJUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9wYWdlcy1hcGkvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9zcmNcXFxccGFnZXNcXFxcYXBpXFxcXGF1dGhcXFxcc2lnbmluLnRzXCI7XG4vLyBSZS1leHBvcnQgdGhlIGhhbmRsZXIgKHNob3VsZCBiZSB0aGUgZGVmYXVsdCBleHBvcnQpLlxuZXhwb3J0IGRlZmF1bHQgaG9pc3QodXNlcmxhbmQsIFwiZGVmYXVsdFwiKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsIFwiY29uZmlnXCIpO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgUGFnZXNBUElSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuUEFHRVNfQVBJLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9zaWduaW5cIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL3NpZ25pblwiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIlwiXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Fsignin&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5Csignin.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./src/pages/api/auth/signin.ts":
/*!**************************************!*\
  !*** ./src/pages/api/auth/signin.ts ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! zod */ \"zod\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cookie */ \"cookie\");\n/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cookie__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uuid */ \"uuid\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([zod__WEBPACK_IMPORTED_MODULE_2__, uuid__WEBPACK_IMPORTED_MODULE_5__]);\n([zod__WEBPACK_IMPORTED_MODULE_2__, uuid__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nconst signinSchema = zod__WEBPACK_IMPORTED_MODULE_2__.z.object({\n    phone: zod__WEBPACK_IMPORTED_MODULE_2__.z.string().min(1, \"Phone number is required\"),\n    password: zod__WEBPACK_IMPORTED_MODULE_2__.z.string().min(6, \"Password must be at least 6 characters long\")\n});\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            message: \"Method not allowed\"\n        });\n    }\n    try {\n        const validatedData = signinSchema.parse(req.body);\n        const user = await prisma.user.findUnique({\n            where: {\n                phone: validatedData.phone\n            }\n        });\n        if (!user) {\n            return res.status(404).json({\n                message: \"User not found\"\n            });\n        }\n        const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(validatedData.password, user.password);\n        if (!isPasswordValid) {\n            return res.status(401).json({\n                message: \"Invalid password\"\n            });\n        }\n        const sessionId = (0,uuid__WEBPACK_IMPORTED_MODULE_5__.v4)();\n        if (user.isLoggedIn) {\n            await prisma.user.update({\n                where: {\n                    id: user.id\n                },\n                data: {\n                    isLoggedIn: false,\n                    sessionId: null\n                }\n            });\n        }\n        await prisma.user.update({\n            where: {\n                id: user.id\n            },\n            data: {\n                isLoggedIn: true,\n                sessionId\n            }\n        });\n        const motorist = await prisma.motorist.findFirst({\n            where: {\n                userId: user.id\n            }\n        });\n        const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_3___default().sign({\n            userId: user.id,\n            phone: user.phone,\n            role: user.role,\n            sessionId\n        }, process.env.JWT_SECRET_KEY, {\n            expiresIn: \"30d\"\n        });\n        res.setHeader(\"Set-Cookie\", (0,cookie__WEBPACK_IMPORTED_MODULE_4__.serialize)(\"session_token\", token, {\n            httpOnly: true,\n            secure: \"development\" === \"production\",\n            maxAge: 30 * 24 * 60 * 60,\n            path: \"/\"\n        }));\n        const { password: _, ...userWithoutPassword } = user;\n        res.status(200).json({\n            message: \"Sign-in successful\",\n            data: userWithoutPassword,\n            accessToken: token,\n            motorist: motorist\n        });\n    } catch (error) {\n        console.error(\"Error during sign-in:\", error);\n        if (error instanceof zod__WEBPACK_IMPORTED_MODULE_2__.z.ZodError) {\n            return res.status(400).json({\n                message: \"Validation failed\",\n                errors: error.errors\n            });\n        }\n        res.status(500).json({\n            message: \"Internal server error\",\n            details: error instanceof Error ? error.message : \"Unknown error\"\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPdEMsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztnQkFBRUMsU0FBUztnQkFBcUJtQyxRQUFRSCxNQUFNRyxNQUFNO1lBQUM7UUFDbkY7UUFHQXZDLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFDbkJDLFNBQVM7WUFDVG9DLFNBQVNKLGlCQUFpQkssUUFBUUwsTUFBTWhDLE9BQU8sR0FBRztRQUNwRDtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb3RlcmVnbmEtYXBpLy4vc3JjL3BhZ2VzL2FwaS9hdXRoL3NpZ25pbi50cz82NmJjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnO1xyXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcclxuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xyXG5pbXBvcnQgeyBzZXJpYWxpemUgfSBmcm9tICdjb29raWUnO1xyXG5pbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xyXG5cclxuY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xyXG5cclxuY29uc3Qgc2lnbmluU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIHBob25lOiB6LnN0cmluZygpLm1pbigxLCAnUGhvbmUgbnVtYmVyIGlzIHJlcXVpcmVkJyksXHJcbiAgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDYsICdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nJyksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG4gIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7IG1lc3NhZ2U6ICdNZXRob2Qgbm90IGFsbG93ZWQnIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHZhbGlkYXRlZERhdGEgPSBzaWduaW5TY2hlbWEucGFyc2UocmVxLmJvZHkpO1xyXG4gICAgXHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgIHdoZXJlOiB7IHBob25lOiB2YWxpZGF0ZWREYXRhLnBob25lIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc1Bhc3N3b3JkVmFsaWQgPSBhd2FpdCBiY3J5cHQuY29tcGFyZSh2YWxpZGF0ZWREYXRhLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKTtcclxuXHJcbiAgICBpZiAoIWlzUGFzc3dvcmRWYWxpZCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBtZXNzYWdlOiAnSW52YWxpZCBwYXNzd29yZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2Vzc2lvbklkID0gdXVpZHY0KCk7XHJcblxyXG4gICAgaWYgKHVzZXIuaXNMb2dnZWRJbikge1xyXG4gICAgICBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xyXG4gICAgICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXHJcbiAgICAgICAgZGF0YTogeyBpc0xvZ2dlZEluOiBmYWxzZSwgc2Vzc2lvbklkOiBudWxsIH0sIFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlci5pZCB9LFxyXG4gICAgICBkYXRhOiB7IGlzTG9nZ2VkSW46IHRydWUsIHNlc3Npb25JZCB9LCBcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG1vdG9yaXN0ID0gYXdhaXQgcHJpc21hLm1vdG9yaXN0LmZpbmRGaXJzdCh7XHJcbiAgICAgIHdoZXJlOiB7IHVzZXJJZDogdXNlci5pZCB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRva2VuID0gand0LnNpZ24oXHJcbiAgICAgIHsgdXNlcklkOiB1c2VyLmlkLCBwaG9uZTogdXNlci5waG9uZSwgcm9sZTogdXNlci5yb2xlLCBzZXNzaW9uSWQgfSxcclxuICAgICAgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVF9LRVkhLFxyXG4gICAgICB7IGV4cGlyZXNJbjogJzMwZCcgfSBcclxuICAgICk7XHJcblxyXG4gICAgcmVzLnNldEhlYWRlcihcclxuICAgICAgJ1NldC1Db29raWUnLFxyXG4gICAgICBzZXJpYWxpemUoJ3Nlc3Npb25fdG9rZW4nLCB0b2tlbiwge1xyXG4gICAgICAgIGh0dHBPbmx5OiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgICBtYXhBZ2U6IDMwICogMjQgKiA2MCAqIDYwLCBcclxuICAgICAgICBwYXRoOiAnLycsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHsgcGFzc3dvcmQ6IF8sIC4uLnVzZXJXaXRob3V0UGFzc3dvcmQgfSA9IHVzZXI7XHJcblxyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiAnU2lnbi1pbiBzdWNjZXNzZnVsJyxcclxuICAgICAgZGF0YTogdXNlcldpdGhvdXRQYXNzd29yZCxcclxuICAgICAgYWNjZXNzVG9rZW46IHRva2VuLFxyXG4gICAgICBtb3RvcmlzdDogbW90b3Jpc3RcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgc2lnbi1pbjonLCBlcnJvcik7XHJcblxyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2Ygei5ab2RFcnJvcikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnVmFsaWRhdGlvbiBmYWlsZWQnLCBlcnJvcnM6IGVycm9yLmVycm9ycyB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBcclxuICAgICAgbWVzc2FnZTogJ0ludGVybmFsIHNlcnZlciBlcnJvcicsIFxyXG4gICAgICBkZXRhaWxzOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJyBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImJjcnlwdCIsInoiLCJqd3QiLCJzZXJpYWxpemUiLCJ2NCIsInV1aWR2NCIsInByaXNtYSIsInNpZ25pblNjaGVtYSIsIm9iamVjdCIsInBob25lIiwic3RyaW5nIiwibWluIiwicGFzc3dvcmQiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsIm1lc3NhZ2UiLCJ2YWxpZGF0ZWREYXRhIiwicGFyc2UiLCJib2R5IiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJzZXNzaW9uSWQiLCJpc0xvZ2dlZEluIiwidXBkYXRlIiwiaWQiLCJkYXRhIiwibW90b3Jpc3QiLCJmaW5kRmlyc3QiLCJ1c2VySWQiLCJ0b2tlbiIsInNpZ24iLCJyb2xlIiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVRfS0VZIiwiZXhwaXJlc0luIiwic2V0SGVhZGVyIiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJtYXhBZ2UiLCJwYXRoIiwiXyIsInVzZXJXaXRob3V0UGFzc3dvcmQiLCJhY2Nlc3NUb2tlbiIsImVycm9yIiwiY29uc29sZSIsIlpvZEVycm9yIiwiZXJyb3JzIiwiZGV0YWlscyIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/auth/signin.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2Fsignin&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5Csignin.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();