// Init schemas
const FriendRequest = require('./models/friendRequest.js');

// Listen /user/friends/get-outgoing-friend-requests path
const getOutgoingFriendRequests = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const requests = await FriendRequest.find({ from: request.session.id });

    response.status(200).json({
        requests: requests,
        message: "Outgoing friend requests got!"
    });
};

module.exports = getOutgoingFriendRequests;

console.log("Get Outgoing Friend Requests module initialized!");