const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://admin:${password}@cluster0.5ianoty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

if (process.argv.length === 5) {
  const entry = new Entry({
    id: Math.round(Math.random() * 10000),
    name: process.argv[3],
    number: process.argv[4],
  });

  entry.save().then((result) => {
    console.log("note saved!");
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
    console.log("Phonebook:")
  Entry.find({}).then((result) => {
    result.forEach((note) => {
      console.log(`note.name ${note.number}`);
    });
    mongoose.connection.close();
  });
}
