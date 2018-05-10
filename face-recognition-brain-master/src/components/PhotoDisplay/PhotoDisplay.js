import React from 'react';
import './PhotoDisplay.css';

const PhotoDisplay = ({ imageUrl, box }) => {
    const boundingBox = (box!==null) ? box.map((pos, id) =>
        <div key={id} className='bounding-box' style={{top: pos[0].topRow, right: pos[0].rightCol, bottom: pos[0].bottomRow, left: pos[0].leftCol}}>
        </div>) : '';
  return (
    <div className='photo-container center ma'>
      <div className='mt2 relative'>
        <img id='inputimage' alt='' src={imageUrl} width='700px' height='auto'/>
        {boundingBox}
      </div>
    </div>
  );
}

export default PhotoDisplay;
