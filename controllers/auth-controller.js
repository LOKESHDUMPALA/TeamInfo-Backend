const bcrypt = require("bcrypt");
const User = require("../models/User");

const saltRounds = 10;

// Signup Function
exports.signup = async (req, res) => {
    try {
        
        const { role, name, email, password, teamname, projectname } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            role, name, email, password: hashedPassword, teamname, projectname
        });

        await user.save();
        res.json({ success: true, message: "Successfully signed up" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Login Function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.json({ success: false, message: "User not registered" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, pwd: false, message: "Wrong password" });

        res.json({ success: true, pwd: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
