const router = require("express").Router();
const apiRoutes = require("./API");
router.use("./API",apiRoutes);
router.use((request,response)=>{
    response.status(404).send("<h1>404 Error</h1>");
});
modules.exports = router;
