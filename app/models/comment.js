const mongoose = require('mongoose')

// This number is enough to allow expressing thoughts, but prevents unreasonable
// comment lengths - it's also the limit supposedly used by Facebook:
// https://sproutsocial.com/insights/social-media-character-counter/#facebook
const COMMENT_MAX_LENGTH = 8000

const commentSchema = new mongoose.Schema({
  author: String,
  content: {
    type: String,
    maxlength: COMMENT_MAX_LENGTH
  },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
