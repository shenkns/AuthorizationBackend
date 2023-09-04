// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/get-name path
const getName = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;

    if(!id) {
        response.status(400).json({
            message: "No id field in request!"
        });
        return;
    }

    const user = await User.findById(id);
    if(user) {
        response.status(200).json( {
            name: user.name,
            message: "Name got!"
        });
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
};

module.exports = getName;

console.log("Get Name module initialized!");