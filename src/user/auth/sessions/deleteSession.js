// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/auth/sessions/delete-session path
const deleteSession = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const sessionToDelete = request.body.session;

    if(!sessionToDelete) {
        response.status(400).json({
            message: "No session field in request!"
        });
        return;
    }

    if(sessionToDelete === request.session.session) {
        response.status(409).json({
            message: "Can't delete current session from itself!"
        });
        return;
    }

    const user = await User.findById(request.session.id)
    if(user) {
        console.log(user.sessions);

        if(user.sessions.includes(sessionToDelete)) {
            user.sessions.pull(sessionToDelete);

            await user.save();

            response.status(200).json({
                message: "Session deleted!"
            });
        }
        else {
            response.status(404).json({
                message: "Deleting session not found!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found, invalid id!"
        });
    }
};

module.exports = deleteSession;

console.log("Delete Session module initialized!");