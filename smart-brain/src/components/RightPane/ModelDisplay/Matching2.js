import React from 'react';
import calculateFaceLocation from '../../Function/calculateFaceLocation';

const nrofMatches = 5; // Number of most similar matches
class Matching2 extends React.Component {
    componentDidUpdate(){
        const {respData, model} = this.props;
        if (!respData.outputs || !respData.outputs[0].data.distances) return;

        const distances = respData.outputs[0].data.distances;

        // display results
        let boundingBox = calculateFaceLocation(respData, model),
            faceDetect = document.getElementById("inputimage"),
            usingCam = false;
        if (!faceDetect) {
            faceDetect = document.getElementById('face_video_canvas');
            usingCam = true;
        }
        if (!boundingBox) return;
        distances.map((x, idx) => {
            return x.distance_info.map((y, idy) => {
                if (idy > nrofMatches-1) return;
                let ctxDetect = this.refs[`resultImageDetect${idx}_${idy}`].getContext('2d'),
                    ctxCompare = this.refs[`resultImageCompare${idx}_${idy}`].getContext('2d'),
                    fd = boundingBox[idx],
                    faceCompare = document.getElementById(x.distance_ID[idy]);
                    if (!faceCompare) return;
                if (!idx && !idy) {
                    this.refs[`container${idx}_${idy}`].classList.add('_best');
                    this.refs[`value${idx}_${idy}`].classList.add('_best');
                }
                if (usingCam) ctxDetect.drawImage(faceDetect,
                    fd.leftCol, fd.topRow,
                    faceDetect.width - (fd.rightCol+fd.leftCol), faceDetect.height - (fd.topRow+fd.bottomRow), 
                    0, 0,
                    80, 80 / (faceDetect.width-(fd.rightCol+fd.leftCol))*(faceDetect.height-(fd.bottomRow+fd.topRow)));
                else
                    ctxDetect.drawImage(faceDetect,
                        fd.leftCol/faceDetect.width*faceDetect.naturalWidth, fd.topRow/faceDetect.height*faceDetect.naturalHeight,
                        faceDetect.naturalWidth-(fd.rightCol+fd.leftCol)/faceDetect.width*faceDetect.naturalWidth,
                        faceDetect.naturalHeight-(fd.bottomRow+fd.topRow)/faceDetect.height*faceDetect.naturalHeight,
                        0,0,
                        80, 80 / (faceDetect.width-(fd.rightCol+fd.leftCol))*(faceDetect.height-(fd.bottomRow+fd.topRow)));
                ctxCompare.drawImage(faceCompare,
                    0,0,
                    80, 80 / faceCompare.width*faceCompare.height);
                return '';
            });
        });
    }
    render(){
        const {respData} = this.props;
        if (!respData.outputs) return '';
        if (!respData.outputs[0].data.distances) return (<h4>No paring faces to compare</h4>);
        const distances = respData.outputs[0].data.distances;
        const faceCanvas = distances.map((x, idx) => {
            return x.distance_info.map((y, idy) => {
                if (idy > nrofMatches-1) return;
                return (
                    <div ref={`container${idx}_${idy}`} key={idy} className="rcontent-result-container">
                        <div className="rcontent-result-detect">
                            <canvas ref={`resultImageDetect${idx}_${idy}`} width='80' height='130'/>
                        </div>
                        <div ref={`value${idx}_${idy}`} className="rcontent-result-value pa2 bt bb b--silver br2 hover-bg-light-gray">{y}</div>
                        <div className="rcontent-result-compare">
                            <canvas ref={`resultImageCompare${idx}_${idy}`} width='80' height='130'/>
                        </div>
                    </div>
                );
            });
        });
        return (
            <div className="rcontent-face dib relative w-100 mb3">
                <div className="rcontent-face-title w-90 pb3 center relative db">
                    <span className="h4 b">Most similar faces (compare to face number [1] only)</span>
                </div>
                    {faceCanvas}
            </div>
        );
    }
}

export default Matching2;
