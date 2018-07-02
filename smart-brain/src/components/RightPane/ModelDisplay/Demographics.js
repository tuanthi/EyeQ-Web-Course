import React from 'react';

const Demographics = ({respData}) => {
    if (!respData.outputs) return '';
    if (!respData.outputs[0].data.regions) return (<h4>No face detected</h4>);
    if (!respData.outputs[0].data.regions[0].data) return '';
    const resData = respData.outputs[0].data.regions[0].data.face;
    const listTemplate = (list, title) => (
        <div className="mb5">
            <div className="rcontent-dg-title tl w-90 pb3 center relative db">
                <span className="f6 b">{title}</span>
                <span className="f6 fr b">Probability</span>
            </div>
            {
                list.map((item) =>
                    <div key={item.id} className="rcontent-dg-item db pa2 w-90 center relative tl lh-copy hover-bg-light-gray">
                        <span className="f6">{item.name}</span>
                        <span className="f6 fr">{Math.round(item.value*1000)/10}%</span>
                    </div>
                )
            }
        </div>
    )
  return (
    <div className="rcontent-dg dib relative w-100">
        {listTemplate(resData.gender_appearance.concepts, "Gender appearance")}
        {listTemplate([resData.age_appearance.concepts[0]], "Age appearance")}
        {listTemplate(resData.multicultural_appearance.concepts, "Multicultural appearance")}
    </div>
  );
}

export default Demographics;
