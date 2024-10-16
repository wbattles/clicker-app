var express = require('express');
var router = express.Router();

async function getClickCount(req, res) {
  try {
    const db = req.db
    const clickEntry = await db.collection('clicks').findOne({});
    
    if (clickEntry) {
      const { clickCount } = clickEntry;
      
      res.json({ clickCount });

    } else {
      res.status(404).json({ error: 'No click data found' });
    }
  } catch (error) {
    console.error('Error fetching click count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.get('/', getClickCount);

async function updateClick(req, res) {
  try {
    const { clickCount } = req.body;

    const db = req.db;
    const result = await db.collection('clicks').updateOne(
      {},
      { $set: { clickCount: clickCount } }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: 'Click data updated successfully', clickCount: clickCount });
    } else {
      res.status(404).json({ error: 'Click document not found' });
    }
  } catch (error) {
    console.error('Error updating click data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.post('/update', updateClick);


module.exports = router;
