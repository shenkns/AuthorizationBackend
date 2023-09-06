// Crypto
const customJWT = require('./crypto/customJWT');

// Init UUID
const { randomUUID } = require('crypto');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/sign-in-guest path
const signInGuest = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userDeviceId = request.body.deviceId;

    if(!userDeviceId) {
        response.status(400).json({
            message: "No deviceId field in request!"
        });
        return;
    }

    var user = await User.findOne({ deviceId: userDeviceId });
    if(user)
    {
        if(user.accountType != 0) {
            response.status(403).json({
                message: "No access, can't sign in to not guest account with device ID!"
            });
            return;
        }

        if(user.sessions.length > 0) {
            console.log(user.sessions[0]);

            const accessToken = customJWT.sign(user._id, user.sessions[0]);

            response.status(200).json({
                id: user._id,
                accessToken: accessToken,
                message: "Account on this device found, successful signed in!"
            });
            return;
        }
        else {
            response.status(401).json({
                message: "No active sessions!"
            });
            return;
        }
    }

    user = new User({ name: "Player1234", accountType: 0, deviceId: userDeviceId });

    const session = randomUUID();
    user.sessions.push(session);

    await user.save();

    const accessToken = customJWT.sign(user._id, session);

    response.status(200).json({
        id: user._id,
        accessToken: accessToken,
        message: "Account not found on this device, created new, successful signed in!"
    });
};

module.exports = signInGuest;

console.log("Sign In Guest module initialized!");