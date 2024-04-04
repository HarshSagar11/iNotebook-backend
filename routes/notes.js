const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    obj = {
        value : 'trying notes'
    };
    res.json(obj);
})

module.exports = router;