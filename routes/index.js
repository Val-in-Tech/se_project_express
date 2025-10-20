const router = require("express").Router();

const userRouter = require("./users");
const { loginUser, createUser, getCurrentUser, updateCurrentUser } = require('../controllers/users');
const clothingRouter = require("./clothingItem");


router.get("/", (req, res) => {
    res.send("Welcome to the WTWR API");
});


// Protected routes (signin/signup are defined publicly in app.js)
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateCurrentUser);

router.use("/users", userRouter);
router.use("/clothing-items", clothingRouter);
router.use("/items", clothingRouter); // Alternative route for tests

router.use((req, res) => {
    res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;