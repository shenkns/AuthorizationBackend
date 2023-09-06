// Crypto
const customMD5 = require('./crypto/customMD5.js');
const customJWT = require('./crypto/customJWT.js');

// Init UUID
const { randomUUID } = require('crypto');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/sign-up path
const signUp = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userName = request.body.name;
    const userEmail = request.body.email;
    var userPassword = request.body.password;
    const userDeviceId = request.body.deviceId;

    if(!userName || !userEmail || !userPassword || !userDeviceId) {
        response.status(400).json({
            message: "No name or email or password or deviceId field in request!"
        });
        return;
    }

    userPassword = customMD5(userPassword);

    const checkUser = await User.findOne({ email: userEmail });
    if(checkUser) {
        response.status(409).json({
            message: "Email already used!"
        });
        return;
    }

    const user = await User.findById(request.session.id);
    if(user) {
        if(user.accountType != 0)
        {
            response.status(409).json({
                message: "Failed to sign up, account already signed up!"
            });
            return;
        }

        if(!(user.deviceId === userDeviceId)) {
            response.status(403).json({
                message: "Failed to sign up, attempt from not owning device"
            });
            return;
        }

        user.accountType = 1;

        user.name = userName;
        user.email = userEmail;
        user.password = userPassword;

        user.sessions = [];
        const session = randomUUID();
        user.sessions.push(session);

        await user.save();

        const accessToken = customJWT.sign(user._id, session);

        response.status(200).json({
            id: user._id,
            accessToken: accessToken,
            message: "Successful signed up!"
        });
    }
    else {
        response.status(404).json({
            message: "Current guest user session not found!"
        });
    }
};

module.exports = signUp;

console.log("Sign Up module initialized!");