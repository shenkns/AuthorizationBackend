// Init schemas
const User = require.main.require('./src/user/models/user.js');
const FriendRequest = require('./models/friendRequest');

// Listen /user/friends/decline-friend-request path
const declineFriendRequest = async function(request, response) {
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

    if(!(friendRequest.to === request.session.id || friendRequest.from === request.session.id)) {
        response.status(403).json({
            message: "Can't decline not owning friend request"
        });
        return;
    }

    await FriendRequest.findByIdAndDelete(id);

    response.status(200).json({
        message: "Friend request declined!"
    });
};

module.exports = declineFriendRequest;

console.log("Decline Friend Request module initialized!");