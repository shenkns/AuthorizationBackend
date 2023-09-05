// Crypto
const customMD5 = require('./crypto/customMD5.js');
const customJWT = require('./crypto/customJWT.js');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/sign-in-email path
const signInEmail = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userEmail = request.body.email;
    var userPassword = request.body.password;

    if(!userEmail || !userPassword) {
        response.status(400).json({
            message: "No email or password field in request!"
        });
        return;
    }

    userPassword = customMD5(userPassword);

    const user = await User.findOne({ email: userEmail });
    if(user) {
        if(user.accountType == 0) {
            response.status(403).json({
                message: "No access, can't sign in to guest account with email!"
            });
            return;
        }

        if(user.password && user.password === userPassword) {
            const accessToken = customJWT.sign(user._id);

            response.status(200).json({
                accessToken: accessToken,
                message: "Successful signed in!"
            });
        }
        else {
            response.status(401).json({
                message: "Invalid password!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
};

module.exports = signInEmail;

console.log("Sign In Email module initialized!");