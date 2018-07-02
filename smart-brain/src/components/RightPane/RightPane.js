import React from 'react';
import './RightPane.css';
import Color from './ModelDisplay/Color';
import General from './ModelDisplay/General';
import Face from './ModelDisplay/Face';
import Matching from './ModelDisplay/Matching';
import Matching2 from './ModelDisplay/Matching2';
import Travel from './ModelDisplay/Travel';
import Demographics from './ModelDisplay/Demographics';

const RightPane = ({currmodel, respData, errmess}) => {
    const renderContent = (model) => {
        switch(model){
            case 'Color': return <Color respData={respData}/>;
            case 'General': return <General respData={respData}/>;
            case 'Face (EyeQ)': return <Face respData={respData} model={model}/>;
            case 'Matching (EyeQ)': return <Matching respData={respData} model={model}/>;
            case 'Matching2': return <Matching2 respData={respData} model={model}/>;
            case 'Travel': return <Travel respData={respData}/>;
            case 'Demographics': return <Demographics respData={respData}/>;
            default: return '';
        }
    }
  return (
    <div className="rcontent-container dib relative w-30 fixed right-0 bg-white tc" style={{height: "92%"}}>
        <h3 className="rcontent-title pb3">{currmodel ? currmodel : 'Please select a model'}</h3>
        <div id="rcontent-camera"></div>
        {errmess ? <span className="h4 b"> {errmess} </span> : <div></div>}
        {renderContent(currmodel)}
    </div>
  );
}

export default RightPane;
