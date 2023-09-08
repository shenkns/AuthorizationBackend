// Init schemas
const User = require.main.require('./src/user/models/user.js');
const FriendRequest = require('./models/friendRequest');

// Listen /user/friends/accept-friend-request path
const acceptFriendRequest = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;

    if(!id) {
        response.status(400).json({
            message: "No id field in request!"
        });
        return;
    }

    const friendRequest = await FriendRequest.findById(id);
    if(!friendRequest) {
        response.status(404).json({
            message: "Friend request not found!"
        });
        return;
    }

    console.log(friendRequest.to);
    console.log(request.session.id);

    if(!(friendRequest.to === request.session.id)) {
        response.status(403).json({
            message: "Can't accept not owning friend request!"
        });
        return;
    }

    const user = await User.findById(friendRequest.to);
    if(!user) {
        response.status(404).json({
            message: "User not found!"
        });
        return;
    }
    const friend = await User.findById(friendRequest.from);
    if(!friend) {
        response.status(404).json({
            message: "Friend not found!"
        });
        return;
    }

    user.friends.push(friendRequest.from);
    await user.save();

    friend.friends.push(friendRequest.to);
    await friend.save();

    await FriendRequest.findByIdAndDelete(id);

    response.status(200).json({
        message: "Friend request accepted!"
    });
};

module.exports = acceptFriendRequest;

console.log("Accept Friend Request module initialized!");