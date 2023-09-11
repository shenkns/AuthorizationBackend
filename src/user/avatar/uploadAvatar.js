// Init UUID
const { randomUUID } = require('crypto');

// Path
const fs = require('fs');
const path = require('path');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/avatar/upload-avatar path
const uploadAvatar = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const avatar = request.files.avatar;

    if(!avatar) {
        response.status(400).json({
            message: "No avatar field in request!"
        });
        return;
    }

    const user = await User.findById(request.session.id);
    if(!user) {
        response.status(404).json({
            message: "User not found!"
        });
        return;
    }

    const staticDir = path.dirname(require.main.filename) + '\\static\\';

    if(user.avatar) {
        fs.unlinkSync(staticDir + user.avatar);
        user.avatar = null;
    }
    
    if(!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir);
    }

    const avatarName = randomUUID() + ".jpg";
    console.log(staticDir + avatarName);
    avatar.mv(staticDir + avatarName);

    user.avatar = avatarName;
    await user.save();

    response.status(200).json({
        avatar: avatarName,
        message: "Avatar uploaded!"
    });
};

module.exports = uploadAvatar;

console.log("Upload Avatar module initialized!");