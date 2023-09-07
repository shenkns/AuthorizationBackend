// Init schemas
const User = require.main.require('./src/user/models/user.js');

// Listen /user/friends/delete-friend path
const deleteFriend = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;

    if(!id) {
        response.status(400).json({
            message: "No id field in request!"
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

    const friend = await User.findById(id);
    if(!friend) {
        response.status(404).json({
            message: "Friend not found!"
        });
        return;
    }

    var deleted = false;

    if(user.friends.includes(id)) {
        user.friends.pull(id);
        await user.save();

        deleted |= true;
    }

    if(friend.friends.includes(request.session.id)) {
        friend.friends.pull(request.session.id);
        await friend.save();

        deleted |= true;
    }

    if(deleted) {
        response.status(200).json({
            message: "Friend deleted!"
        });
        return;
    }

    response.status(409).json({
        message: "Failed to delete, this user not your friend!"
    });
};

module.exports = deleteFriend;

console.log("Delete Friend module initialized!");