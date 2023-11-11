const User = require("../../Database/userSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { emailSender } = require("../../helper/emailSender");



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KET_JWT);
};


const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            console.log("User already exists");
            return res.status(400).send({ message: "User already exists" });
        }


        const hashPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            name,
            email,
            password: hashPassword,
            status: true
        })

        await newUser.save();
        let html = `<html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                padding: 20px;
              }
        
              h1 {
                color: #ff6600;
                text-align: center;
              }
        
              p {
                font-size: 18px;
                color: #333;
                text-align: center;
              }
        
              
            </style>
          </head>
          <body>
            <h1>Your account has been created</h1>
            <p>Hello <span class="username">${newUser.name}</span>,</p>
            <p>Your email (<span class="useremail">${newUser.email}</span>) 
          </body>
        </html>`
        await emailSender(newUser.email, html, "Welcome to Example.com");

        const userId = newUser._id;
        const token = await createToken(userId);

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Server error" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({ email }).then(async (user) => {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = await createToken(user._id);
            console.log(token)
            res.status(200).json({ token });
        } else {
            res.status(404).send({ error: "invalid email or password" });
        }
    }).catch((err) => {
        res.status(404).send({ error: "invalid email or password" });
    })
}

const fetchUser = async (req, res) => {
    const { id } = req.params;
    const userValid = await User.findOne({ _id: id });
    if (userValid.status) {
        const user = {
            id: userValid._id,
            email: userValid.email,
            name: userValid.name
        }
        res.status(200).json({ user })
    } else {
        res.status(404).send({ error: "user blocked" });
    }

}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const userValid = await User.findOne({ _id: id });
        if (userValid.status) {
            const newUser = await User.findByIdAndUpdate(id, { name, email });
            const user = {
                id: newUser._id,
                email,
                name
            }
            res.status(200).json({ user })
        } else {
            res.status(404).send({ error: "user blocked" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Server error" });
    }

}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { pass, newPass } = req.body;
        const userValid = await User.findOne({ _id: id });
        if (userValid.status) {
            const match = await bcrypt.compare(pass, userValid.password);
            if (match) {
                if (pass === newPass) return res.status(404).send({ message: "New password same as current password" });
                const hashPassword = await bcrypt.hash(newPass, 10);
                const newUser = await User.findByIdAndUpdate(id, { password: hashPassword });
                const user = {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name
                }
                res.status(200).json({ user })
            } else {
                res.status(404).send({ message: "Invalid Current Password" });
            }

        } else {
            res.status(404).send({ message: "user blocked" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error" });
    }

}



module.exports.signup = signup;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.editUser = editUser;
module.exports.fetchUser = fetchUser;
