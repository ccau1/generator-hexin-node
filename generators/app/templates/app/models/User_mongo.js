'use strict';

const mongoose = require('hexin-core/helpers/Database').getConnection();

const {Schema} = mongoose;

const UserSchema = new Schema({
  roles: [String],
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  loginChannel: {
    type: {type: String, required: true},
    id: {type: String}
  },
  password: {type: String, minLength: 8},
  resetToken: {
    token: {type: String},
    expiredAt: {type: String}
  },
  avatars: [
    {
      fileMetaId: {type: Schema.Types.ObjectId, required: true},
      name: {type: String, required: true},
      uri: {type: String, required: true},
      default: {type: Boolean, required: true}
    }
  ]
}, {collection: 'users'});

// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
  callback();
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
