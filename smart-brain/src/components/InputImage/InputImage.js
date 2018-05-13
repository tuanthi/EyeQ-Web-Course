import React from 'react';
import './InputImage.css';

const InputImage = ({onInputChange, onButtonSubmit}) => {
    return (
        <div className='inputimg-container mt2 center w-100'>
            <div className='center pa3 w-75'>
                <input
                    className='f5 pa2 w-80 center br3 br--left'
                    type='text'
                    onChange={onInputChange}
                    placeholder="Enter image URL here..."/>
                <button
                    className='w-20 grow f5 link ph3 pv2 dib white bg-navy'
                    onClick={onButtonSubmit}
                >Submit</button>
            </div>
        </div>
    );
}

export default InputImage;
