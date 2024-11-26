const express = require('express');
const router = express.Router();
const { signUp, login, setupLogin } = require('../../controller/auth/auth.controller');

router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is login api page!"
    });
});

router.post('/signUp', signUp);
router.post('/login', login);

router.post('/setupLogin', setupLogin);

module.exports = router;