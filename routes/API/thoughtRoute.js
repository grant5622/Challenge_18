const router = require ("express").Router();

const {
    getAllThoughts,
    getThoughtByID,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction,
} = require ("../../controller/thoughtController");
router.route("/").get(getAllThoughts).post(addThought);
router.route("/:thoughtID").get(getThoughtByID).put(updateThought).delete(removeThought);
router.route("/:thoughtID/reactions").post(addReaction);
router.route("/:thoughtID/reactions/:reactionID").delete(removeReaction);
module.exports = router