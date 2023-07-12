const router = require ("express").Router();
const {
    getAllUsers,
    getUserByID,
    addUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require ("../../controller/userController");
router.route ("/").get(getAllUsers).post(addUser);
router.route ("/:userID").get(getUserByID).put(updateUser).delete(deleteUser);
router.route ("/:userID/friends/:friendID").post(addFriend).delete(deleteFriend);
modules.exports = router;