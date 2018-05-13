import React from 'react';
import './RightPane.css';
import Color from './ModelDisplay/Color';
import General from './ModelDisplay/General';
import Face from './ModelDisplay/Face';
import Travel from './ModelDisplay/Travel';
import Demographics from './ModelDisplay/Demographics';

const RightPane = ({currmodel, respData}) => {
    const renderContent = (model) => {
        switch(model){
            case 'Color': return <Color respData={respData}/>;
            case 'General': return <General respData={respData}/>;
            case 'Face': return <Face respData={respData}/>;
            case 'Travel': return <Travel respData={respData}/>;
            case 'Demographics': return <Demographics respData={respData}/>;
            default: return '';
        }
    }
  return (
    <div className="rcontent-container dib relative w-30 bg-white" style={{height: '100%'}}>
        <h3 className="rcontent-title pb3">{currmodel ? currmodel : 'Please select a model'}</h3>
        {renderContent(currmodel)}
    </div>
  );
}

export default RightPane;
