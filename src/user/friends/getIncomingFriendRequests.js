// Init schemas
const FriendRequest = require('./models/friendRequest.js');

// Listen /user/friends/get-incoming-friend-requests path
const getIncomingFriendRequests = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const requests = await FriendRequest.find({ to: request.session.id });

    response.status(200).json({
        requests: requests,
        message: "Incoming friend requests got!"
    });
};

module.exports = getIncomingFriendRequests;

console.log("Get Incoming Friend Requests module initialized!");