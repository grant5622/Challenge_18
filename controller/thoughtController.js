const { ThoughtModel, UserModel } = require( "../models" );

const thoughtController = {
    getAllThoughts ( req, res )
    {
        Thought.find( {} )
            .populate( {
                path: "reactions",
                select: "-__v",
            } )
            .select( "-__v" )
            .sort( { _id: -1 } )
            .then( ( thoughts ) => res.json( thoughts ) )
            .catch( ( err ) =>
            {
                console.log( err );
                res.sendStatus( 400 );
            } );
    },

    getThoughtById ( { params }, res )
    {
        ThoughtModel.findOne( { _id: params.id } )
            .populate( {
                path: "reactions",
                select: "-__v",
            } )
            .select( "-__v" )
            .then( ( thought ) =>
            {
                if ( !thought )
                {
                    return res.status( 404 ).json( { message: "No thought with this id!" } );
                }
                res.json( thought );
            } )
            .catch( ( err ) =>
            {
                console.log( err );
                res.sendStatus( 400 );
            } );
    },

    createThought ( { params, body }, res )
    {
        ThoughtModel.create( body )
            .then( ( { _id } ) =>
            {
                return UserModel.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            } )
            .then( ( user ) =>
            {
                if ( !user )
                {
                    return res
                        .status( 404 )
                        .json( { message: "Thought created but no user with this id!" } );
                }

                res.json( { message: "Thought successfully created!" } );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    updateThought ( { params, body }, res )
    {
        ThoughtModel.findOneAndUpdate( { _id: params.id }, body, {
            new: true,
            runValidators: true,
        } )
            .then( ( thought ) =>
            {
                if ( !thought )
                {
                    res.status( 404 ).json( { message: "No thought found with this id!" } );
                    return;
                }
                res.json( thought );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    deleteThought ( { params }, res )
    {
        ThoughtModel.findOneAndDelete( { _id: params.id } )
            .then( ( thought ) =>
            {
                if ( !thought )
                {
                    return res.status( 404 ).json( { message: "No thought with this id!" } );
                }

                return UserModel.findOneAndUpdate(
                    { thoughts: params.id },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                );
            } )
            .then( ( user ) =>
            {
                if ( !user )
                {
                    return res
                        .status( 404 )
                        .json( { message: "Thought created but no user with this id!" } );
                }
                res.json( { message: "Thought successfully deleted!" } );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    addReaction ( { params, body }, res )
    {
        ThoughtModel.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then( ( thought ) =>
            {
                if ( !thought )
                {
                    res.status( 404 ).json( { message: "No thought with this id" } );
                    return;
                }
                res.json( thought );
            } )
            .catch( ( err ) => res.json( err ) );
    },

    removeReaction ( { params }, res )
    {
        ThoughtModel.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then( ( thought ) => res.json( thought ) )
            .catch( ( err ) => res.json( err ) );
    },
};

module.exports = thoughtController;