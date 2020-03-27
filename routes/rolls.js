const router = require('express').Router();
let Roll = require('../models/roll');

router.route('/').get((req, res) => {
    Roll.find({}, { comments: { $slice: -5}})
        .then(rolls => res.json(rolls))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Roll.findById(req.params.id)
        .then(roll => res.json(roll))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const description = req.body.description;
    const rollCount = Number(req.body.rollCount)
    const rollSize = Number(req.body.rollSize)
    const rollResult = Number(req.body.rollResult)
    const rollBonus = Number(req.body.rollBonus)
    const date = Date.parse(req.body.date);
    const R = Number(req.body.R)
    const G = Number(req.body.G)
    const B = Number(req.body.B)
    const ownDice = Boolean(req.body.ownDice)

    const newRoll = new Roll({
        username,
        description,
        rollCount,
        rollSize,
        rollResult,
        rollBonus,
        date,
        R,
        G,
        B,
        ownDice
    });

    newRoll.save()
        .then(() => res.json('Roll added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;