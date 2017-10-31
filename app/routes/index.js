const router = require("express").Router();

const measurements = require("./measurements.js");
const stats = require("./stats.js");

router.use('/measurements', measurements);
router.use('/stats', stats);

module.exports = router;