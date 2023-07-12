const { UserModel, ThoughtModel } = require( "../models" );

const userController = {
    getAllUsers ( req, res )
    {
        UserModel.find( {} )
            .populate( {
                path: "friends",
                select: "-__v",
            } )
            .select( "-__v" )
            .sort( { _id: -1 } )
            .then( ( users ) => res.json( users ) )
            .catch( ( err ) =>
            {
                console.log( err );
                res.sendStatus( 400 );
            } );
    },

    getUserById ( { params }, res )
    {
        UserModel.findOne( { _id: params.id } )
            .populate( {
                path: "thoughts",
                select: "-__v",
            } )
            .populate( {
                path: "friends",
                select: "-__v",
            } )
            .select( "-__v" )
            .then( ( user ) =>
            {
                if ( !user )
                {
                    return res.status( 404 ).json( { message: "No user found with this id!" } );
                }
                res.json( user );
            } )
            .catch( ( err ) =>
            {
                console.log( err );
                res.sendStatus( 400 );
            } );
    },

    createUser ( { body }, res )
    {
        UserModel.create( body )
            .then( ( userData ) => res.json( userData ) )
            .catch( ( err ) => res.json( err ) );
    },

    updateUser ( { params, body }, res )
    {
        UserModel.findOneAndUpdate( { _id: params.id }, body, {
            new: true,
            runValidators: true,
        } )
            .then( ( userData ) =>
            {
                if ( !userData )
                {
                    res.status( 404 ).json( { message: "No user found with this id!" } );
                    return;
                }
                res.json( userData );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    deleteUser ( { params }, res )
    {
        UserModel.findOneAndDelete( { _id: params.id } )
            .then( ( userData ) =>
            {
                if ( !userData )
                {
                    return res.status( 404 ).json( { message: "No user with this id!" } );
                }
                return ThoughtModel.deleteMany( { _id: { $in: userData.thoughts } } );
            } )
            .then( () =>
            {
                res.json( { message: "User and associated thoughts deleted!" } );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    addFriend ( { params }, res )
    {
        UserModel.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then( ( userData ) =>
            {
                if ( !userData )
                {
                    res.status( 404 ).json( { message: "No user with this id" } );
                    return;
                }
                res.json( userData );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    removeFriend ( { params }, res )
    {
        UserModel.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then( ( userData ) =>
            {
                if ( !userData )
                {
                    return res.status( 404 ).json( { message: "No user with this id!" } );
                }
                res.json( userData );
            } )
            .catch( ( err ) => res.json( err ) );
    },
};

module.exports = userController;
