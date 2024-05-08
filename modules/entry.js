const mongoose = require("mongoose");

const URL = process.env.URL;

mongoose.set("strictQuery", false);

mongoose.connect(URL).then((res) => {
  console.log("Connected to Mongo!");
}).catch((res) => {
  console.log("Error connecting to Mongo!", res.message);
});

const entrySchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, minlength: 3 },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d*$/.test(v) && v.length >= 8;
      },
      message: (props) => `${props.value} is not a valid phone number.`,
    },
    required: true,
  },
});

entrySchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Entry", entrySchema);
