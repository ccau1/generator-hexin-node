'use strict';

const MongoGenericRepository = require('@httpeace_deploy/httpeace-node-core/repos/MongoGenericRepository');
const mongoose = require('@httpeace_deploy/httpeace-node-core/helpers/Database').getConnection();

class UserRepo extends MongoGenericRepository {
  constructor(ctxt) {
    super(ctxt.User, ctxt);
  }

  async getAvatarsByUser(userId, query) {
    const {_model} = this;

    const result = await _model.aggregate(
      {'$match': {'_id': mongoose.Types.ObjectId(userId)}},
      {'$unwind': '$avatars'},
      {'$match': query},
      {$project: {'avatars._id': 1, 'avatars.name': 1, 'avatars.default': 1}}
    );

    return result;
  }

  async getAvatarsById(avatarId) {
    const {_model} = this;

    const result = await _model.aggregate(
      {'$unwind': '$avatars'},
      {'$match': {'avatars._id': mongoose.Types.ObjectId(avatarId)}},
      {$project: {'avatars._id': 1, 'avatars.name': 1, 'avatars.default': 1}}
    );

    return result;
  }

  async deleteAvatarsById(avatarId) {
    const {_model} = this;

    const result = await _model.update({},
      {$pull: {'avatars': {'_id': mongoose.Types.ObjectId(avatarId)}}});

    return result;
  }
}

module.exports = UserRepo;
