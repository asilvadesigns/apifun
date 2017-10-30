const router = require("express").Router();

const measurements = require("./measurements.js");
const stats = require("./stats.js");

router.use('/measurements', measurements);
router.use('/stats', stats);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

module.exports = router;
