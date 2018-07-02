import React from 'react';
import calculateFaceLocation from '../../Function/calculateFaceLocation';

class Face extends React.Component {
    componentDidUpdate(){
        const {respData, model} = this.props;
        if (!respData.outputs) return;

        const boundingBox = calculateFaceLocation(respData, model),
              faceDetect = document.getElementById("inputimage");

        boundingBox.map((item, id) => {
            if (!this.refs[`result${id}`]) return;
            let ctxDetect = this.refs[`result${id}`].getContext('2d');
            ctxDetect.drawImage(faceDetect,
                item.leftCol/faceDetect.width*faceDetect.naturalWidth, item.topRow/faceDetect.height*faceDetect.naturalHeight,
                faceDetect.naturalWidth-(item.rightCol+item.leftCol)/faceDetect.width*faceDetect.naturalWidth,
                faceDetect.naturalHeight-(item.bottomRow+item.topRow)/faceDetect.height*faceDetect.naturalHeight,
                0,0,
                80, 80 / (faceDetect.width-(item.rightCol+item.leftCol))*(faceDetect.height-(item.bottomRow+item.topRow)));
        });
    }


    render(){
        const {respData} = this.props;
        if (!respData.outputs) return '';
        if (!respData.outputs[0].data.regions) return (<h4>No face detected</h4>);
        const demograph = respData.outputs[0].data.demograph;
        const nFace = respData.outputs[0].data.regions[0].region_info.length;
        const listTemplate = (list, title) => (
            <div className="mb5">
                <div className="rcontent-dg-title tl w-90 pb3 center relative db">
                    <span className="f6 b">{title}</span>
                    <span className="f6 fr b">Value</span>
                </div>
                {
                    Object.keys(list).map((key, id) =>
                    <div key={id} className="rcontent-dg-item db pa2 w-90 center relative tl lh-copy hover-bg-light-gray">
                        <span className="f6">{key}</span>
                        <span className="f6 fr">{isNaN(list[key]) ? list[key] : (Math.round(list[key]*100)/100).toString()+'%'}</span>
                    </div>
                )
            }
        </div>
    )
    return (
        <div className="rcontent-face dib relative w-100">
            <div className="rcontent-face-title w-90 pb3 center relative db">
                <span className="h4 b">{nFace} face(s) detected</span>
            </div>
            {demograph ?
                demograph.map((item, id) =>
                <div key={id} className="rcontent-face-rescontainer">
                    <canvas ref={`result${id}`} width='80' height='130'/>
                    {listTemplate(item.appearance, "Appearance")}
                    {listTemplate(item.emotions, "Emotions")}
                    {listTemplate(item.expressions, "Expressions")}
                </div>
            ) : ''}
        </div>
    );
    }
}

export default Face;
