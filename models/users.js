const { Schema, model } = require( "mongoose" );

const CustomUserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            required: "Username is Required",
        },

        email: {
            type: String,
            unique: true,
            required: "Username is Required",
            match: [ /.+@.+\..+/ ],
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

CustomUserSchema.virtual( "friendCount" ).get( function ()
{
    return this.friends.length;
} );

const UserModel = model( "User", CustomUserSchema );

module.exports = UserModel;
