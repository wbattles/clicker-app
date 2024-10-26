import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './the_button';

export default function ClickGame() {
  const [clickData, setClickData] = useState(null);
  const [localClickCount, setLocalClickCount] = useState(0);

  useEffect(() => {
    axios.get('/api/click')
      .then(response => {
        setClickData(response.data);
        setLocalClickCount(0);
      })
      .catch(error => console.error('Error fetching click data:', error));
  }, []);

  const handleClick = () => {
    setLocalClickCount(localClickCount + 1);
  };

  const handleSave = () => {
    const newGlobalClicks = clickData.clickCount + localClickCount;

    axios.post('/api/click/update', { clickCount: newGlobalClicks })
      .then(() => {
        setClickData((prevClickData) => ({ ...prevClickData, clickCount: newGlobalClicks }));
        setLocalClickCount(0);
      })
      .catch(error => console.error('Error saving global click data:', error));
  };

  return (
    <div>
      <p>{JSON.stringify(clickData)}</p>
      <Button onClick={handleClick} localClickCount={localClickCount} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}