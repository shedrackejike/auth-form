const router = require('express').Router();
const {verify} = require('../model/verifyToken');

router.get('/', verify, (req, res) =>{
    console.log("fufhfiubdiusbiuf");
    res.json({
        posts:{
            title: 'my first post',
            description: 'random data you shouldnt access'
        }
    });
});

module.exports = router;