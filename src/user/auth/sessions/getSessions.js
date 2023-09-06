// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/sessions/get-sessions path
const getSessions = async function(request, response) {
    const user = await User.findById(request.session.id);
    if(user) {
        response.status(200).json({
            sessions: user.sessions,
            message: "Sessions got!"
        });
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
}

module.exports = getSessions;

console.log("Get Sessions module initialized!");