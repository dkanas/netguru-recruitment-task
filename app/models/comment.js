const mongoose = require('mongoose')

// This number is enough to allow expressing thoughts, but prevents unreasonable
// comment lengths - it's also the limit supposedly used by Facebook:
// https://sproutsocial.com/insights/social-media-character-counter/#facebook
const COMMENT_MAX_LENGTH = 8000
const COMMENT_MIN_LENGTH = 5

const AUTHOR_MAX_LENGTH = 100
const AUTHOR_MIN_LENGTH = 3

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    maxlength: AUTHOR_MAX_LENGTH,
    minlength: AUTHOR_MIN_LENGTH
  },
  content: {
    required: true,
    type: String,
    maxlength: COMMENT_MAX_LENGTH,
    minlength: COMMENT_MIN_LENGTH
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
