var mongoose = require('mongoose');
var dbdata = {
    connectDatabase: function connectDatabase() {
        mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true, useUnifiedTopology: true,
                maxPoolSize: 10,
                minPoolSize: 5
            }
        );
         mongoose.set('strictQuery', true);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, "connection error"))
        db.once('open', () => {
            console.log("mongodb connected successfully")
        })

    }
}
module.exports = dbdata