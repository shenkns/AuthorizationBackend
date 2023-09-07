// Init schemas
const User = require.main.require('./src/user/models/user.js');

// Listen /user/friends/get-friends path
const getFriends = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const user = User.findById(request.session.id);
    if(!user) {
        response.status(404).json({
            message: "User not found!"
        });
        return;
    }

    response.status(200).json({
        friends: user.friends,
        message: "Friends got!"
    });
};

module.exports = getFriends;

console.log("Get Friends module initialized!");