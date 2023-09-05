// Init Express JWT
const jwt = require('jsonwebtoken');
const accessTokenSecret = '_p=$%4-X-i!5p*lgdQbFmVBtmn=mxPC*jz6K$7$GAcw$bmcOcYJd8OOwJ*xDkv=n';

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
                        message: "No access!"
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

    // JWT sign
    static sign(id, session) {
        return jwt.sign({ id: id, session: session}, accessTokenSecret);
    };
};

// Export
module.exports = customJWT;