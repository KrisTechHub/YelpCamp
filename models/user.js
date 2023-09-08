const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
     email: {
          type: String,
          required: true,
          unique: true
     }
});

UserSchema.plugin(passportLocalMongoose)//pass in the result of requiring that passport package to UserSchema.plugin

module.exports = mongoose.model('User', UserSchema);