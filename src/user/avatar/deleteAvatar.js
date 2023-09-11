// Init UUID
const { randomUUID } = require('crypto');

// Path
const fs = require('fs');
const path = require('path');

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/avatar/delete-avatar path
const deleteAvatar = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const user = await User.findById(request.session.id);
    if(!user) {
        response.status(404).json({
            message: "User not found!"
        });
        return;
    }

    if(!user.avatar) {
        response.status(200).json({
            message: "Nothing to delete, there are no avatar!"
        });
        return;
    }

    const staticDir = path.dirname(require.main.filename) + '\\static\\';
    fs.unlinkSync(staticDir + user.avatar);
    
    user.avatar = null;
    await user.save();

    response.status(200).json({
        message: "Avatar deleted!"
    });
};

module.exports = deleteAvatar;

console.log("Delete Avatar module initialized!");