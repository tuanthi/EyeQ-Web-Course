import React from 'react';

const Color = ({respData}) => {
    if (!respData.outputs || !respData.outputs[0].data.colors) return '';

    const pickTextColorBasedOnBgColor = (bgColor, lightColor, darkColor) => {
      var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
      var r = parseInt(color.substring(0, 2), 16); // hexToR
      var g = parseInt(color.substring(2, 4), 16); // hexToG
      var b = parseInt(color.substring(4, 6), 16); // hexToB
      var uicolors = [r / 255, g / 255, b / 255];
      var c = uicolors.map((col) => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
      return (L > 0.179) ? darkColor : lightColor;
    }

  return (
    <div className="rcontent-color dib relative w-100">
        {
            respData.outputs[0].data.colors.map((item, id) =>
                <div key={id} className="db mb2 br2 pa2 w-90 center relative tl lh-copy"
                    style={{backgroundColor: item.w3c.hex,
                            color: pickTextColorBasedOnBgColor(item.w3c.hex, '#EEE', '#111')
                        }}
                >
                    <span className="f6">{item.w3c.hex} {item.w3c.name}</span>
                    <span className="f6 fr">{Math.round(item.value*1000)/10}%</span>
                </div>
            )
        }
    </div>
  );
}

export default Color;
