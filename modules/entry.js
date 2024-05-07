const mongoose = require("mongoose");

const URL = process.env.URL

mongoose.set("strictQuery", false);

mongoose.connect(URL).then((res) => {
    console.log("Connected to Mongo!")
}).catch((res) => {
    console.log("Error connecting to Mongo!", res.message)
})

const entrySchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
});

entrySchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model("Entry", entrySchema);