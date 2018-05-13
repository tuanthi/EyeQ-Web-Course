import React from 'react';

const Travel = ({respData}) => {
    if (!respData.outputs || !respData.outputs[0].data.concepts) return '';

  return (
    <div className="rcontent-general dib relative w-100">
        <div className="rcontent-travel-title tl w-90 pb3 center relative db">
            <span className="f6 b">Predicted concept(s)</span>
            <span className="f6 fr b">Probability</span>
        </div>
        {
            respData.outputs[0].data.concepts.map((item) =>
                <div key={item.id} className="rcontent-travel-item db pa2 w-90 center relative tl lh-copy hover-bg-light-gray">
                    <span className="f6">{item.name}</span>
                    <span className="f6 fr">{Math.round(item.value*1000)/10}%</span>
                </div>
            )
        }
    </div>
  );
}

export default Travel;
