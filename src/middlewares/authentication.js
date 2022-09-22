const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
//=======================================(authentication)===============================================///


const authentication = async function (req, res, next) {
    try {
        let headers = req.headers["x-api-key"];

        //Token present or not
        if (!headers) {
            return res.status(400).send({ status: false, msg: "Please enter token number." })
        }
        //if any other key present in key
        const token = headers.split(" ")[0];

        //Verify sekret key
        jwt.verify(String(token), process.env.secretKey, (err, user) => {
            if (err) {
                res.status(401).send({ status: false, msg: "Invalid Token" })
            } else {
                // res.send(author)
                req.Id = user.userId;
                next();
            }
        })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//====================================================================================//
module.exports = { authentication}