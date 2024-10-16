import React from 'react';

export default function Button({ onClick,  localClickCount }) {
  return (
    <div>
      <p>Clicks: { localClickCount }</p>
      <button onClick={onClick}>Add</button>
    </div>
  );
}
