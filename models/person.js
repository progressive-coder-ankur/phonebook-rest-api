const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to the MongoDB database..');

mongoose
  .connect(url)
  .then(result => {
    console.log('conected to MongoDB database..');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Person Name is required'],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`,
    },
    required: [true, 'Person Number is required'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);