import React, {Component} from 'react';
import Sliderbar3t from './Sliderbar3t';
import './InputImage.css';

class InputImage extends Component {
    constructor(){
        super();
        this.state = {
            inpMethod: '',
        }
    }

    scrollUp = () => {
        let doc = document.documentElement,
            top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        if (top > 0) {
            window.scrollTo(0, top - top*0.15)
            setTimeout(this.scrollUp, 10)
        }
    }
    onMethodChange = (method) => {
        this.setState({inpMethod: method});
        if (method==='wcam') {
            this.props.processCamera(true);
            this.scrollUp();
        }
        if (this.state.inpMethod==='wcam' && !method) {
            this.props.processCamera(false);
            this.scrollUp();
        }
    }

    render(){
        const {onInputChange, onButtonSubmit, onFileChange, onSliderChange, inpdisplay} = this.props;

        return (
            <div className='inputimg-container mt2 center w-100'>
                {inpdisplay==='double' ? <Sliderbar3t onSliderChange={onSliderChange}/> : ''}
                {!this.state.inpMethod ?
                    <div className='center pa3 w-75'>
                        <button
                            className='input-btn w-20 shadow-hover f5 link ph3 pv2 dib white bg-navy'
                            onClick={() => this.onMethodChange('url')}
                        >Image URL</button>
                        <button
                            className='input-btn w-20 shadow-hover f5 link ph3 pv2 dib white bg-navy'
                            onClick={() => this.onMethodChange('file')}
                        >Upload file</button>
                    {inpdisplay === 'doublegrid' ?
                        <button
                            className='input-btn w-20 shadow-hover f5 link ph3 pv2 dib white bg-navy'
                            onClick={() => this.onMethodChange('wcam')}
                        >Webcam</button> : ''}
                    </div> :

                    <div className='center pa3 w-75'>
                        {this.state.inpMethod==='url' ?
                            <input
                                className='input-active f5 pa2 w-70 dib br3 br--left'
                                type='text'
                                onChange={(e) => {this.scrollUp(); onInputChange(e, 'detect')}}
                                placeholder="Enter image URL here..."/>
                            : (this.state.inpMethod==='file' ?
                                <label className="input-file grow f5 link ph3 pv2 dib white">
                                    <input
                                        className='input-active'
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {this.scrollUp(); onFileChange(e, 'detect')}}/>
                                    Choose file (detect)
                                </label> : ''
                            )
                        }
                        {this.state.inpMethod!=='wcam' ?
                            <button
                                className='input-ctrl-btn grow f5 link ph3 pv2 dib white bg-navy'
                                onClick={onButtonSubmit}
                            >Submit</button> : ''
                        }
                        <button
                            className='input-ctrl-btn grow f5 link ph3 pv2 dib white bg-gray'
                            onClick={() => this.onMethodChange('')}
                        >Back</button>
                        {inpdisplay==='double' && this.state.inpMethod==='url' ?
                            <input
                                className='input-active f5 pa2 w-70 dib br3 br--right'
                                type='text'
                                onChange={(e) => onInputChange(e, 'compare')}
                                placeholder="Enter image URL to compare here..."/> : ''
                        }
                        {inpdisplay==='double' && this.state.inpMethod==='file'?
                            <label className="input-file grow f5 link ph3 pv2 dib white">
                                <input
                                    className='input-active'
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onFileChange(e, 'compare')}/>
                                Choose file (compare)
                            </label> : ''
                        }
                    </div>
                }
            </div>
        );
    }
}

export default InputImage;
