// Create express app
var express = require("express");
const path = require('path');
var app = express();

console.log( path.join(__dirname, '/../docs') );
app.use('/docs', express.static(path.join(__dirname, '/../docs')));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// We're just using sqlite for storage
var db = require("./database.js");
var md5 = require("md5");

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint for testers to ensure everything is working
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

/**
 * @api {get} /api/users 4) List Users
 * @apiName ListUsers
 * @apiGroup User
 *
 * @apiSuccess {String} message Is always 'success' if request was good.
 * @apiSuccess {Object[]} data Array of user profiles.
 * @apiSuccess {Integer} data.id User's id.
 * @apiSuccess {String} data.name User's name.
 * @apiSuccess {String} data.email User's email address.
 * @apiSuccess {String} data.password User's hashed password.
 * @apiSuccess {String} data.createdAt User's creation date and time.
 * @apiSuccess {String} data.updatedAt User's last updated date and time.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * "message": "success",
 * "data": [
 *     {
 *         "id": 1,
 *         "name": "admin",
 *         "email": "admin@example.com",
 *         "password": "a66abb5684c45962d887564f08346e8d",
 *         "createdAt": "2019-11-10T18:13:39.836Z",
 *         "updatedAt": null
 *     },
 *     {
 *         "id": 2,
 *         "name": "user",
 *         "email": "user@example.com",
 *         "password": "4da49c16db42ca04538d629ef0533fe8",
 *         "createdAt": "2019-11-10T18:13:39.836Z",
 *         "updatedAt": null
 *    }
 * ]
 */
/*
╦  ┬┌─┐┌┬┐  ╦ ╦┌─┐┌─┐┬─┐┌─┐
║  │└─┐ │   ║ ║└─┐├┤ ├┬┘└─┐
╩═╝┴└─┘ ┴   ╚═╝└─┘└─┘┴└─└─┘
*/
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});


/**
 * @api {get} /api/users/:id 2) Get Single User
 * @apiName GetUser
 * @apiGroup User
 * @apiParam {Number} id Users unique ID (in URL).
 * @apiSuccess {String} message Is always 'success' if request was good.
 * @apiSuccess {Object} data User object.
 * @apiSuccess {Integer} data.id User's id.
 * @apiSuccess {String} data.name User's name.
 * @apiSuccess {String} data.email User's email address.
 * @apiSuccess {String} data.password User's hashed password.
 * @apiSuccess {String} data.createdAt User's creation date and time.
 * @apiSuccess {String} data.updatedAt User's last updated date and time.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * "message": "success",
 * "data":
 *     {
 *         "id": 3,
 *         "name": "user",
 *         "email": "user@example.com",
 *         "password": "4da49c16db42ca04538d629ef0533fe8",
 *         "createdAt": "2019-11-10T18:13:39.836Z",
 *         "updatedAt": null
 *    }
 */
/*
╔═╗┌─┐┌┬┐  ╔═╗┬┌┐┌┌─┐┬  ┌─┐  ╦ ╦┌─┐┌─┐┬─┐
║ ╦├┤  │   ╚═╗│││││ ┬│  ├┤   ║ ║└─┐├┤ ├┬┘
╚═╝└─┘ ┴   ╚═╝┴┘└┘└─┘┴─┘└─┘  ╚═╝└─┘└─┘┴└─
 */
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

/**
 * @api {post} /api/users 1) Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {String} name Mandatory name.
 * @apiParam {String} email Mandatory email.
 * @apiParam {String} password Mandatory password.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Timmy Testificate",
 *       "email": "timmy.test@leighton.com",
 *       "password": "Testing123.",
 *     }
 * @apiSuccess (201 Created) {String} message Is always 'success' if request was good.
 * @apiSuccess (201 Created) {Object} data User object.
 * @apiSuccess (201 Created) {String} data.name User's name.
 * @apiSuccess (201 Created) {String} data.email User's email address.
 * @apiSuccess (201 Created) {String} data.password User's hashed password.
 * @apiSuccess (201 Created) {String} data.createdAt User's creation date and time.
 * @apiSuccess (201 Created) {Integer} id New id.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 OK
 * "message": "success",
 * "data":
 *     {
 *         "name": "user",
 *         "email": "user@example.com",
 *         "password": "4da49c16db42ca04538d629ef0533fe8",
 *         "createdAt": "2019-11-10T18:20:56.558Z"
 *    },
 * "id": 3
 */
/*
╔═╗┬─┐┌─┐┌─┐┌┬┐┌─┐  ╔╗╔┌─┐┬ ┬  ╦ ╦┌─┐┌─┐┬─┐
║  ├┬┘├┤ ├─┤ │ ├┤   ║║║├┤ │││  ║ ║└─┐├┤ ├┬┘
╚═╝┴└─└─┘┴ ┴ ┴ └─┘  ╝╚╝└─┘└┴┘  ╚═╝└─┘└─┘┴└─
 */
app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password),
        createdAt: new Date().toISOString()
    };
    var sql ='INSERT INTO user (name, email, password, createdAt) VALUES (?,?,?,?)'
    var params =[data.name, data.email, data.password, data.createdAt]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.status(201).json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

/**
 * @api {patch} /api/users/:id 3) Update Single User
 * @apiName UpdateUser
 * @apiGroup User
 * @apiParam {Integer} id Mandatory id (in URL).
 * @apiParam {String} name Mandatory name.
 * @apiParam {String} email Mandatory email.
 * @apiParam {String} password Mandatory password to be hashed.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "New Admin Name",
 *       "email": "new.admin.email@leighton.com",
 *       "password": "NewPassword123.",
 *     }
 * @apiSuccess {String} message Is always 'success' if request was good.
 * @apiSuccess {Object} data User object.
 * @apiSuccess {String} data.name User's name.
 * @apiSuccess {String} data.email User's email address.
 * @apiSuccess {String} data.password User's hashed password.
 * @apiSuccess {String} data.updatedAt User's last updated date and time.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * "message": "success",
 * "data":
 *     {
 *         "name": "user",
 *         "email": "user@example.com",
 *         "password": "4da49c16db42ca04538d629ef0533fe8"
 *         "updatedAt": "2019-11-10T18:18:29.509Z"
 *    }
 */
/*
╦ ╦┌─┐┌┬┐┌─┐┌┬┐┌─┐  ╦ ╦┌─┐┌─┐┬─┐
║ ║├─┘ ││├─┤ │ ├┤   ║ ║└─┐├┤ ├┬┘
╚═╝┴  ─┴┘┴ ┴ ┴ └─┘  ╚═╝└─┘└─┘┴└─
 */
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null,
        updatedAt: new Date().toISOString()
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password),
           updatedAt = COALESCE(?,updatedAt)
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id, data.updatedAt],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
});

/**
 * @api {delete} /api/users/:id 5) Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam {Number} id Users unique ID (in URL).
 * @apiSuccess {String} message Is always 'deleted' if request was good.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message": "deleted",
 * }
 */
/*
╔╦╗┌─┐┬  ┌─┐┌┬┐┌─┐  ╦ ╦┌─┐┌─┐┬─┐
 ║║├┤ │  ├┤  │ ├┤   ║ ║└─┐├┤ ├┬┘
═╩╝└─┘┴─┘└─┘ ┴ └─┘  ╚═╝└─┘└─┘┴└─
 */
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
