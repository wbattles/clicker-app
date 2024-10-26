var express = require('express');
var router = express.Router();

async function getClickCount(req, res) {
  try {
    const db = req.db;
    if (!db) {
      console.error('Database not initialized');
      return res.status(500).json({ error: 'Database not initialized' });
    }

    console.log('Fetching click count...');
    const clickEntry = await db.collection('clicks').findOne({});
    console.log('Click entry:', clickEntry);
    
    if (clickEntry) {
      const { clickCount } = clickEntry;
      return res.json({ clickCount });
    } else {
      await db.collection('clicks').insertOne({ clickCount: 0 });
      return res.json({ clickCount: 0 });
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

    if (!db) {
      console.error('Database not initialized');
      return res.status(500).json({ error: 'Database not initialized' });
    }

    console.log('Updating click count to:', clickCount);
    const result = await db.collection('clicks').updateOne(
      {},
      { $set: { clickCount: clickCount } },
      { upsert: true }
    );

    console.log('Update result:', result);
    res.json({ 
      message: 'Click data updated successfully', 
      clickCount: clickCount 
    });
  } catch (error) {
    console.error('Error updating click data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.post('/update', updateClick);

module.exports = router;
