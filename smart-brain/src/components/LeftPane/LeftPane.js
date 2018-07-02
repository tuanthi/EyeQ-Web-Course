import React from 'react';
import './LeftPane.css';
import ModelSelection from '../ModelSelection/ModelSelection';
import PhotoDisplay from '../PhotoDisplay/PhotoDisplay';
import InputImage from '../InputImage/InputImage';
import calculateFaceLocation from '../Function/calculateFaceLocation';

const LeftPane = ({ onInputChange, onButtonSubmit, onModelSelect, onFileChange, onSliderChange, onLoadChange, processCamera,
                    respData, imageUrl, currmodel, inpdisplay, usingwcam }) => {

    const getmarks = (data) => {
        if ( !['Face (EyeQ)', 'Matching (EyeQ)'].includes(currmodel) || !data.outputs) return null;
        if (!data.outputs[0].data.marks) return null;

        let image = document.getElementById('inputimage');
        let width = Number(image.width);
        let height = Number(image.height);
        let marks = data.outputs[0].data.marks;
        let detect_marks = marks[0].mark_info.map((item, id) => item.xmark.map((e, i) => [e * width, item.ymark[i] * height]) )
        let compare_marks = []
        if (marks[1]){
            image = document.getElementById('inputimage_com');
            width = Number(image.width);
            height = Number(image.height);
            compare_marks = marks[1].mark_info.map((item, id) => item.xmark.map((e, i) => [e * width, item.ymark[i] * height]) )
        }
        return {detect_marks: detect_marks, compare_marks: compare_marks}
    }
    return (
        <div className="lpane-container dib relative w-70 v-top h-100">
            <ModelSelection onModelSelect={onModelSelect} currmodel={currmodel}/>
            <PhotoDisplay
                box={ calculateFaceLocation(respData, currmodel) }
                marks={ getmarks(respData) }
                imageUrl={imageUrl}
                inpdisplay={inpdisplay}
                onLoadChange={onLoadChange}
                usingwcam={usingwcam}
            />
            <InputImage
                onInputChange={onInputChange}
                onButtonSubmit={onButtonSubmit}
                onFileChange={onFileChange}
                onSliderChange={onSliderChange}
                processCamera={processCamera}
                inpdisplay={inpdisplay}
            />
        </div>
    );
}

export default LeftPane;
