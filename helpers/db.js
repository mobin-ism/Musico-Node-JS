const mongoose = require('mongoose');

module.exports.connect = async function connect() {
    try {
        const connection = await mongoose.connect('mongodb://localhost/musico_dev');
        console.log("Database Successfully Connected ");
    } catch (error) {
        console.log("Database connection failed due to: ", error.message);
    }
}

module.exports.mongoose = mongoose;