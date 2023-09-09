// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Listen /user/change-name path
const changeName = async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const name = request.body.name;

    if(!name) {
        response.status(400).json({
            message: "No name field in request!"
        });
        return;
    }

    const user = await User.findById(request.session.id);
    if(user) {
        if(user.name === name) {
            response.status(409).json({
                message: "Conflict old name equals new!"
            });
            return;
        }

        user.name =  name;
        await user.save();

        response.status(200).json( {
            name: user.name,
            message: "Name changed!"
        });
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
};

module.exports = changeName;

console.log("Change Name module initialized!");