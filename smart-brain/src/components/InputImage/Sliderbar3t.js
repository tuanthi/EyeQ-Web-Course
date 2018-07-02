import React from 'react';

const Sliderbar3t = ({onSliderChange}) => {
    const onSliderInput = (e) => {
        let val = Number(e.target.value);
        onSliderChange(e);
        document.getElementById("slider-val").innerHTML = val;
        document.getElementById("slider-val-container").style.left = `calc(${val+50}% - ${(val+50)*0.25}px)`;
    }
    return (
        <div className="slider-container">
            <input type="range" min="-50" max="50" defaultValue="0" id="slider3t" step="1" onChange={onSliderInput}/>
            <div id="slider-val-container">
                <div id="slider-val">0</div>
                <div id="slider-val-bg"></div>
            </div>
        </div>
    );
}

export default Sliderbar3t;
