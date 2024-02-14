const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
    title: {
        required : true,
        type: String
    },
    body: {
        required : true,
        type: String
    },
    image: {
        required : true,
        type: String
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: "users"
    }
})

module.exports = mongoose.model("Post",postSchema);