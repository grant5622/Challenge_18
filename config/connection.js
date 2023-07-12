const mongoose = require ("mongoose");

mongoose.connect (
    process.env.MONGODB_URI || "mongodb://localhost:27017/social", {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
);

mongoose.set ("debug", true);
modules.exports = mongoose.connection;