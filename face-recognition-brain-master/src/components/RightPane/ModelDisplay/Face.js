import React from 'react';

const Face = ({respData}) => {
    if (!respData.outputs) return '';
    if (!respData.outputs[0].data.regions) return (<h4>No face detected</h4>);
    const nFace = respData.outputs[0].data.regions.length;
    const faceRegions = document.getElementsByClassName('bounding-box');
  return (
    <div className="rcontent-face dib relative w-100">
        <div className="rcontent-face-title w-90 pb3 center relative db">
            <span className="h4 b">{nFace} face(s) detected</span>
        </div>
    </div>
  );
}

export default Face;
