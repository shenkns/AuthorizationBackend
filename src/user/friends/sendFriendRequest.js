// Init schemas
const User = require.main.require('./src/user/models/user.js');
const FriendRequest = require('./models/friendRequest');

// Listen /user/friends/send-friend-request path
const sendFriendRequest = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;

    if(!id) {
        response.status(400).json({
            message: "No id field in request!"
        });
        return;
    }

    if(id === request.session.id) {
        response.status(409).json({
            message: "Conflict, can't send friend request to yourself!"
        });
        return;
    }

    const user = await User.findById(id);
    if(!user) {
        response.status(404).json({
            message: "User not found!"
        });
    }

    if(user.friends.includes(request.session.id)) {
        response.status(409).json({
            message: "This user already your friend!"
        });
        return;
    }

    var friendRequest = await FriendRequest.findOne({$or: [{from: request.session.id, to: id}, {to: request.session.id, from: id}]});
    if(friendRequest) {
        response.status(409).json({
            message: "Request already sent to this user!"
        });
        return;
    }

    console.log(id);
    console.log(request.session.id);
    friendRequest = new FriendRequest({ from: request.session.id, to: id });
    await friendRequest.save();

    response.status(200).json({
        requestId: friendRequest._id,
        message: "Friend request successful sent!"
    });
};

module.exports = sendFriendRequest;

console.log("Send Friend Request module initialized!");