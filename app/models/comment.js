const mongoose = require('mongoose')

// This number is enough to allow expressing thoughts, but prevents unreasonable
// comment lengths - it's also the limit supposedly used by Facebook:
// https://sproutsocial.com/insights/social-media-character-counter/#facebook
const COMMENT_MAX_LENGTH = 8000
const COMMENT_MIN_LENGTH = 5

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    required: true,
    type: String,
    maxlength: COMMENT_MAX_LENGTH,
    minLength: COMMENT_MIN_LENGTH
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
