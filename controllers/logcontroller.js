// const {Router} = require('express')
let express = require('express');
// const { restart } = require('nodemon');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
const Log = require('../db').import('../models/log')

// router.get('/', validateSession, function (req, res){
//     res.send ("Log endpoint Test")
// })

router.post('/', validateSession, (req, res) => {
    const logEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner: req.user.id
    }
    Log.create(logEntry)
    .then((log) => res.status(200).json(log))
    .catch((err) => res.status(500).json({error: err}))
});

// router.get('/',  function (req, res){
//     // const query = {where: {owner: req.user.id}}
//     Log.findAll()
//     .then((logs) => res.status(200).json(logs))
//     .catch((err) => res.status(500).json({ error: err }));
// });


//GET ALL LOGS FROM EVERYONE
// router.get('/', function (req, res){
//     // const query = {where: {owner: req.user.id}}
//     Log.findAll()
//     .then((logs) => res.status(200).json(logs))
//     .catch((err) => res.status(500).json({ error: err }));
// });

//GET ALL LOGS FROM ONE SPECIFIC USER
router.get('/', validateSession, function (req, res){
    // const query = {where: {owner: req.user.id}}
    let userid = req.user.id
    Log.findAll({
        where: {owner: userid}
    })
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET ONE LOG FROM ONE USER
router.get('/:id', validateSession, function (req, res){
    let userid = req.user.id
    // const query = { where: {owner: userid} }
    Log.findOne({
        where: {id: req.params.id, owner: req.user.id}
    })
        .then((logs) => res.status(200).json(logs))
        .catch((err) => res.status(500).json({error: err}))
});

//GET LOGS BY WORKOUT DESCRIPTION (the /:id above this must be commented out for this to work)
// router.get('/:description', function(req, res){
//     let description = req.params.description;
//     Log.findAll({
//         where: { description: description}
//     })
//     .then(logs => res.status(200).json(logs))
//     .catch(err => res.status(500).json({error: err}))
// })


router.put('/update/:resultId', validateSession, function (req, res){
    const updateLogEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result, 
    };

    const query = { where: { id: req.params.resultId, owner: req.user.id}};

    Log.update(updateLogEntry, query)
    .then ((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({error: err}));
})


router.delete("/delete/:id", validateSession, function(req, res){
    const query = { where: {id: req.params.id, owner: req.user.id}};

    Log.destroy(query)
    .then(() => res.status(200).json({message: "Log Entry Removed"}))
    .catch((err) => res.status(500).json({error:err}));
});


module.exports = router