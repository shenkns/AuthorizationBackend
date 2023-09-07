const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    from: String,
    to: String
}, {versionKey: false});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

// Export
module.exports = FriendRequest