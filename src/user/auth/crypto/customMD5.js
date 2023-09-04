const crypto = require('crypto');

const customMD5 = function md5(content) {  
    return crypto.createHash('md5').update(content).digest('hex');
};

// Export method
module.exports = customMD5;