import React from 'react';
import './LeftPane.css';
import ModelSelection from '../ModelSelection/ModelSelection';
import PhotoDisplay from '../PhotoDisplay/PhotoDisplay';
import InputImage from '../InputImage/InputImage';

const LeftPane = ({ onInputChange, onButtonSubmit, onModelSelect, respData, imageUrl, currmodel }) => {
    const calculateFaceLocation = (data) => {
        data = data.respData;
        if ( !['Face', 'Demographics'].includes(currmodel) || !data.outputs) return null;
        if (!data.outputs[0].data.regions) return null;
        const clarifaiFace = data.outputs[0].data.regions;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return clarifaiFace.map((item) => [{
                leftCol: item.region_info.bounding_box.left_col * width,
                topRow: item.region_info.bounding_box.top_row * height,
                rightCol: width - (item.region_info.bounding_box.right_col * width),
                bottomRow: height - (item.region_info.bounding_box.bottom_row * height)
            }] );
    }
    return (
        <div className="lpane-container dib relative w-70 v-top h-100">
            <ModelSelection onModelSelect={onModelSelect} currmodel={currmodel}/>
            <PhotoDisplay box={ calculateFaceLocation({respData}) } imageUrl={imageUrl} />
            <InputImage onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
        </div>
    );
}

export default LeftPane;
