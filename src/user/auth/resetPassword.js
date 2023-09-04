// Crypto
const customMD5 = require('./crypto/customMD5.js');
const customJWT = require('./crypto/customJWT.js');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/reset-password path
const resetPassword = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;
    var oldPassword = request.body.oldPassword;
    var newPassword = request.body.newPassword;

    if(!id || !oldPassword || !newPassword) {
        response.status(400).json({
            message: "No id or oldPassword or newPassword field in request!"
        });
        return;
    }

    oldPassword = customMD5(oldPassword);
    newPassword = customMD5(newPassword);

    if(!(request.user.id === id)) {
        console.log(request.user.id);
        console.log(id);
        response.status(403).json({
            message: "You don't have permission to access!"
        });
        return;
    }

    const user = await User.findById(id);
    if(user) {
        if(user.password && user.password === oldPassword) {
            if(oldPassword === newPassword) {
                response.status(409).json({
                    message: "New password equals old!"
                });
                return;
            }

            user.password = newPassword;
            await user.save();

            const accessToken = customJWT.sign(user._id);

            response.status(200).json({
                accessToken: accessToken,
                message: "Password successful changed!"
            });
        }
        else {
            response.status(401).json({
                message: "Invalid current password!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
};

module.exports = resetPassword;

console.log("Reset Password module initialized!");