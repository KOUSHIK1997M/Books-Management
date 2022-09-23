const isValidUserData = require('../dataValidation/inputDataValidation')
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
//========================================>  (( Create a user api call )) <==================================//

const createUser = async (req, res) => {
    try {
        // using destructuring of body data.
        const { title, name, phone, email, password, address } = req.body;

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(req.body)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        let msgTitleData = isValidUserData.isValidTitle(title)
        if (msgTitleData) {
            return res.status(400).send({ status: false, message: msgTitleData })
        }

        let msgNameData = isValidUserData.isValidName(name)
        if (msgNameData) {
            return res.status(400).send({ status: false, message: msgNameData })
        }

        let msgPhoneData = isValidUserData.isValidPhone(phone)
        if (msgPhoneData) {
            return res.status(400).send({ status: false, message: msgPhoneData })
        }

        const isPhoneUnique = await userModel.findOne({phone});
        if (isPhoneUnique) {
            return res.status(400).send({ status: false, message: `mobile number: ${phone} already exist` });
        }

        let msgEmailData = isValidUserData.isValidEmail(email)
        if (msgEmailData) {
            return res.status(400).send({ status: false, message: msgEmailData })
        }

        const isEmailUnique = await userModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: false, message: `email: ${email} already exist` });
        }

        let msgPassData = isValidUserData.isValidpass(password)
        if (msgPassData) {
            return res.status(400).send({ status: false, message: msgPassData })
        }

        let msgAddressData = isValidUserData.isValidAddress(address)
        if (msgAddressData) {
            return res.status(400).send({ status: false, message: msgAddressData })
        }

        //Create user data after format
        const hashedPassword = await bcrypt.hash(password.trim(), 10)
        const userData = {
            title: title.trim(),
            name: name.trim(),
            phone: phone,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            address: address
        };

        const newUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "new user registered successfully", data: newUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//========================================>  (( Login a user, api call )) <==================================//

const loginUser = async (req, res) => {
    try {
        // using destructuring of body data.
        const { email, password } = req.body;

        //Input data validation
        let msgUserData = isValidUserData.isValidRequest(req)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        let msgEmailData = isValidUserData.isValidEmail(email)
        if (msgEmailData) {
            return res.status(400).send({ status: false, message: msgEmailData })
        }
        const isEmailUnique = await userModel.findOne({ email });
        if (!isEmailUnique) {
            return res.status(401).send({ status: false, message: "invalid login credentials" });
        }

        let msgPassData = isValidUserData.isValidpass(password)
        if (msgPassData) {
            return res.status(400).send({ status: false, message: msgPassData })
        }

        //Input data verify
        let Password = bcrypt.compare(password, isEmailUnique.password)
        if (!Password) {
            return res.status(401).send({ status: false, message: "invalid login credentials" });
        }

        // creating JWT
        const token = jwt.sign({ userId: isEmailUnique._id }, process.env.secretKey, { expiresIn: "1h" });
        res.header("x-api-key", token);
        return res.status(200).send({ status: true, message: "login successful", data: token });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser, loginUser }