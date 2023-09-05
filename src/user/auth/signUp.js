// Crypto
const customMD5 = require('./crypto/customMD5.js');

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

    const checkUser = await User.find({ email: userEmail });
    if(checkUser.length > 0) {
        response.status(409).json({
            message: "Email already used!"
        });
        return;
    }

    const user = new User({ name: userName, email: userEmail, password: userPassword, accountType: 1, deviceId: userDeviceId });

    await user.save();
    response.status(200).json({
        id: user._id,
        message: "Successful signed up!"
    });
};

module.exports = signUp;

console.log("Sign Up module initialized!");