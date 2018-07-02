import React from 'react';
import calculateFaceLocation from '../../Function/calculateFaceLocation';

class Matching extends React.Component {
    componentDidUpdate(){
        const {respData, model} = this.props;
        if (!respData.outputs) return;

        const distances = respData.outputs[0].data.distances;
        // analyze results
        let faceDetectId, faceCompareId = 0;
        let minDist = 999;
        distances.map((x, idx) => {
            return x.distance_info.map((y, idy) => {
                if (minDist > y){
                    minDist = y;
                    faceDetectId = idx;
                    faceCompareId = idy;
                }
                return '';
            });
        });

        // display results
        const boundingBox = calculateFaceLocation(respData, model),
              faceDetect = document.getElementById("inputimage"),
              faceCompare = document.getElementById("inputimage_com");

        distances.map((x, idx) => {
            return x.distance_info.map((y, idy) => {
                let ctxDetect = this.refs[`resultImageDetect${idx}_${idy}`].getContext('2d'),
                    ctxCompare = this.refs[`resultImageCompare${idx}_${idy}`].getContext('2d'),
                    fd = boundingBox.detect_box[idx],
                    fc = boundingBox.compare_box[idy];
                if (idx===faceDetectId && idy===faceCompareId) {
                    this.refs[`container${idx}_${idy}`].classList.add('_best');
                    this.refs[`value${idx}_${idy}`].classList.add('_best');
                }
                ctxDetect.drawImage(faceDetect,
                    fd.leftCol/faceDetect.width*faceDetect.naturalWidth, fd.topRow/faceDetect.height*faceDetect.naturalHeight,
                    faceDetect.naturalWidth-(fd.rightCol+fd.leftCol)/faceDetect.width*faceDetect.naturalWidth,
                    faceDetect.naturalHeight-(fd.bottomRow+fd.topRow)/faceDetect.height*faceDetect.naturalHeight,
                    0,0,
                    80, 80 / (faceDetect.width-(fd.rightCol+fd.leftCol))*(faceDetect.height-(fd.bottomRow+fd.topRow)));
                ctxCompare.drawImage(faceCompare,
                    fc.leftCol/faceCompare.width*faceCompare.naturalWidth, fc.topRow/faceCompare.height*faceCompare.naturalHeight,
                    faceCompare.naturalWidth-(fc.rightCol+fc.leftCol)/faceCompare.width*faceCompare.naturalWidth,
                    faceCompare.naturalHeight-(fc.bottomRow+fc.topRow)/faceCompare.height*faceCompare.naturalHeight,
                    0,0,
                    80, 80 / (faceCompare.width-(fc.rightCol+fc.leftCol))*(faceCompare.height-(fc.bottomRow+fc.topRow)));
                return '';
            });
        });
    }
    render(){
        const {respData} = this.props;
        if (!respData.outputs) return '';
        if (!respData.outputs[0].data.distances) return (<h4>No paring faces to compare</h4>);
        const distances = respData.outputs[0].data.distances;
        const columnid = distances[0].distance_info.map((item, id) => {
            return (<td key={id}><b>{id+1}</b></td>);
        });

        const distanceResult = distances.map((item, id) => {
            return (<tr key={id} className="hover-bg-light-gray">
                <td><b>{id+1}</b></td>
                {item.distance_info.map((value, idv) => <td key={idv} className="pa2 ba b--light-gray br1">{value}</td>)}
            </tr>);
        });
        const faceCanvas = distances.map((x, idx) => {
            return x.distance_info.map((y, idy) => {
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
            <div className="rcontent-face dib relative w-100">
                <div className="rcontent-face-title w-90 pb3 center relative db">
                    <span className="h4 b">Most similar faces</span>
                </div>

                    {faceCanvas}

                <div className="rcontent-face-title w-90 pb3 center relative db">
                    <span className="h4 b">Distance matrix of faces</span>
                </div>
                <table className="ba b--gray br3 pa2 center-ns mb3">
                    <thead>
                        <tr>
                            <td></td>
                            {columnid}
                        </tr>
                    </thead>
                    <tbody>
                        {distanceResult}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Matching;
