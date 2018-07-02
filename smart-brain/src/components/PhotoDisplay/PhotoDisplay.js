import React from 'react';
import './PhotoDisplay.css';

class PhotoDisplay extends React.Component {
    constructor(){
        super();
        this.state = {
            inputfaces: [],
            imageUrl: [],
            name: '',
            facegrid: ''
        }
    }
    componentDidMount(){
        this.facegrid();
    }
    //---------------------------------------------------------------------------------------------------
    boundingBox = (btype) => {
        const {box} = this.props;
        if (!box) return '';
        var res = box;
        if (btype && box[btype]) res = box[btype];
        return res.map((pos, id) =>
            <div key={id}
                className='bounding-box'
                style={{top: pos.topRow, right: pos.rightCol, bottom: pos.bottomRow, left: pos.leftCol}}>
                <div className='bounding-box-id'>{id+1}</div>
            </div>);
    }

    faceMarks = (mtype) => {
        const {marks} = this.props;
        if (!marks) return '';
        if (mtype && marks[mtype]) var res = marks[mtype];
        else return '';
        return res.map((item, id) =>
            item.map((e, i) =>
                <div key={i} className='face-mark' style={{left: e[0]-2, top: e[1]-2}}></div>)
        );
    }

    facegrid = () => {
        fetch('https://services.eyeq.tech/back/storage/getfaces', {
          method: 'get',
          headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            const faces = response.outputs[0].data;
            const data = faces.map((row, idr) => (
                <div key={idr} className='face-row-container mb1'>
                    <div>{row[0].name}</div>
                    {row.map((item, idi) =>
                        <img key={idi} id={item.ID} src={"data:image/jpeg;base64,"+item.path} alt='faces'/>
                    )}
                </div>)
            )
            this.setState({facegrid: data});
        })
        .catch(err => {
            console.log(err);
        });
    }

    updateGrid = () => {
        this.props.onLoadChange(true);
        fetch('https://services.eyeq.tech/back/api/face_detect', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              name: this.state.name,
              imagebase64: this.state.imageUrl,
              type: 'extract'
          })
        })
        .then(response => response.json())
        .then(response => {
            this.props.onLoadChange(false);
            if (response.errmess){
                alert(response.errmess);
                return;
            }
            const data = (
                <div className='face-row-container mb1'>
                    <div>{response[0].name}</div>
                    {response.map((item, idx) => (
                        <img key={idx} id={item.ID} src={"data:image/jpeg;base64,"+item.path} alt='faces'/>
                    ))}
                </div>)
            this.setState({facegrid: [...this.state.facegrid, data]});
        })
        .catch(err => {
            this.props.onLoadChange(false);
            console.log(err);
        });
    }

    onFileChange = (e) => {
        if (!e.target.files) return;
        for (const [key, file] of Object.entries(e.target.files)) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                this.setState({
                    inputfaces: [...this.state.inputfaces, file],
                    imageUrl: [...this.state.imageUrl, reader.result.substring('data:image/jpeg;base64,'.length)]
                });
            }
        }
        if (!this.state.name){
            let fname = document.getElementById('face-new-name');
            fname.style.background="#e8b5ab";
            fname.focus();
        }
    }

    onInputChange = (e) => {
        document.getElementById('face-new-name').style.background="white";
        this.setState({name: e.target.value});
    }

    onButtonSubmit = () => {
        if (!this.state.name){
            let fname = document.getElementById('face-new-name');
            fname.style.background="#e8b5ab";
            fname.focus();
            return;
        }
        this.updateGrid();
    }

    render (){
        const { imageUrl, inpdisplay, usingwcam } = this.props;
        return (
            <div className='photo-container center ma'>
                {inpdisplay==='double' || inpdisplay==='doublegrid' ?
                    <div className='frame-container dt w-100'>
                        <div className='v-mid relative shadow-4 dtc w-50 mt2 ph2'>
                            <div className='relative center-ns' style={{width: 'fit-content'}}>
                                {(usingwcam) ?
                                    <div id='inputcamera' className="relative">
                                        <div id='bounding-box'></div>
                                    </div> :
                                    <div>
                                        <img id='inputimage'  alt='' src={imageUrl.detect} width='auto' height='auto'style={{maxHeight: "460px"}}/>
                                        <div className='bounding-box-container'>
                                            {this.boundingBox('detect_box')}
                                        </div>
                                        <div className='face-mark-container'>
                                            {this.faceMarks('detect_marks')}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {inpdisplay==='double' ?
                            <div className='dtc v-mid mt2 relative dib w-50 shadow-4'>
                                <div className='relative center-ns' style={{width: 'fit-content'}}>
                                    {imageUrl.compare ? <img id='inputimage_com' alt='Comparison image' src={imageUrl.compare} width='auto' height='auto' style={{maxHeight: "460px", maxWidth: "450px"}}/> : ''}
                                    <div className='bounding-box-container'>
                                        {this.boundingBox('compare_box')}
                                    </div>
                                    <div className='face-mark-container'>
                                        {this.faceMarks('compare_marks')}
                                    </div>
                                </div>
                            </div> :
                            <div style={{overflowY: "auto", height: "390px"}}>
                                <div id='face-grid-container' className='ma2 w-80' style={{marginLeft: "auto"}}>
                                    {this.state.facegrid}
                                </div>
                                <div className='face-newinput-container tc ma2 w-60' style={{marginLeft: "auto", marginRight: "auto"}}>
                                    <input id='face-new-name' className="ph2 pv1 br2 w-50 db mv2 center" type='text' placeholder="Person's name" onChange={(e)=>this.onInputChange(e)}/>
                                    <label className="input-file grow f5 link ph3 pv2 dib white">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="input-btn shadow-hover f5 link ph3 pv2 dib near-black bg-moon-gray bn br2"
                                            onChange={(e) => this.onFileChange(e, 'compare')}
                                            multiple
                                            />
                                        Upload face(s)
                                        <span className="input-file-tooltip f6">Please choose image(s) that contain only 1 face</span>
                                    </label>
                                    <button className="w-40 grow f5 link ph3 pv2 dib white bg-navy"
                                            onClick={() => this.onButtonSubmit()}>
                                            Submit
                                    </button>
                                </div>
                            </div>
                        }
                    </div>:
                    <div className='mt2 relative'>
                        <img id='inputimage' alt='' src={imageUrl.detect} width='auto' height='460px'/>
                        <div className='bounding-box-container'>
                            {this.boundingBox('detect_box')}
                        </div>
                        <div id='face-mark-container-detect' className='face-mark-container'>
                            {this.faceMarks('detect_marks')}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default PhotoDisplay;
