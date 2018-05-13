import React from 'react';
import './ModelSelection.css';

const ModelSelection = ({onModelSelect, currmodel}) => {
    const modelList = ["General", "Color", "Face", "Demographics", "Travel"];
    const isActive = (model) => 'model-txt dib f5 ma2 link moon-gray pa2 pointer ' + ((model===currmodel)?'model-txt-active':'');
    const modelElement = modelList.map((item, id) =>
        <p key={id}
            onClick={() => onModelSelect({item})}
            className={isActive(item)}>{item}</p>
    );
    return (
        <div className="model-container db relative tl shadow-5 bg-black-10">
            {modelElement}
        </div>
    );
}

export default ModelSelection;
