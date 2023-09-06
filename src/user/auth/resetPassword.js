// Crypto
const customMD5 = require('./crypto/customMD5.js');
const customJWT = require('./crypto/customJWT.js');

// Init UUID
const { randomUUID } = require('crypto');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/reset-password path
const resetPassword = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userId = request.body.id;
    var userOldPassword = request.body.oldPassword;
    var userNewPassword = request.body.newPassword;
    const userResetSessions = request.body.resetSessions;

    if(!userId || !userOldPassword || !userNewPassword) {
        response.status(400).json({
            message: "No id or oldPassword or newPassword field in request!"
        });
        return;
    }

    userOldPassword = customMD5(userOldPassword);
    userNewPassword = customMD5(userNewPassword);

    if(!(request.session.id === userId)) {
        response.status(403).json({
            message: "You don't have permission to access!"
        });
        return;
    }

    const user = await User.findById(userId);
    if(user) {
        if(user.accountType == 0) {
            response.status(403).json({
                message: "No access, can't reset password for guest account!"
            });
            return;
        }

        if(user.password && user.password === userOldPassword) {
            if(userOldPassword === userNewPassword) {
                response.status(409).json({
                    message: "New password equals old!"
                });
                return;
            }

            user.password = userNewPassword;

            if(userResetSessions == 1) {
                user.sessions = [];
                const session = randomUUID();
                user.sessions.push(session);

                await user.save();

                const accessToken = customJWT.sign(user._id, session);

                response.status(200).json({
                    accessToken: accessToken,
                    message: "Password successful changed and sessions reset!"
                });
            }
            else {
                await user.save();

                response.status(200).json({
                    message: "Password successful changed!"
                });
            }
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