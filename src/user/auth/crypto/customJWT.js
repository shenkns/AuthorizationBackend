// Init Express JWT
const jwt = require('jsonwebtoken');
const accessTokenSecret = '_p=$%4-X-i!5p*lgdQbFmVBtmn=mxPC*jz6K$7$GAcw$bmcOcYJd8OOwJ*xDkv=n';

// Init User schema
const User = require.main.require('./src/user/models/user.js');

// Custom JWT class
class customJWT
{
    constructor() {
        console.log("CustomJWT module initialized!");
    };

    // JWT request verifier
    static authenticateJWT(request, response, next) {
        const authHeader = request.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, accessTokenSecret, (error, session) => {
                if (error || !session || !session.id || !session.session) {
                    return response.status(403).json({
                        message: "No access, bad parser token!"
                    });
                }

                request.session = session;

                console.log("Authorized request from " + request.session.id + " " + request.session.session);
                next();
            });
        } else {
            response.status(401).json({
                message: "No authorization header!"
            });
        }
    };

    // JWT session verifier
    static async verifySession(request, response, next) {
        const userId = request.session.id;

        if(!userId) {
            response.status(400).json({
                message: "No id field in JWT token header!"
            });
            return;
        }

        const user = await User.findById(userId);
        if(user)
        {
            console.log(request.session.session);
            console.log(user.sessions);
            if(user.sessions.includes(request.session.session)) {
                next();
            }
            else {
                response.status(403).json({
                    message: "Invalid session!"
                });
            }
            return;
        }
        else {
            response.status(404).json({
                message: "User not found, invalid id in JWT token!"
            });
            return;
        }
    };

    // JWT sign
    static sign(id, session) {
        console.log("Custom JWT session " + session + " signed for " + id)

        return jwt.sign({ id: id, session: session}, accessTokenSecret);
    };
};

// Export
module.exports = customJWT;