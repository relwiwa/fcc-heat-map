import React, { Component } from 'react';

import '../styles/cells.scss';

const Bars = (props) => {
  const { cellHeight, cellWidth, currData, margins, onUpdateCurrDatum, styleSpex, xScale, yScale } = props;

  return (
    <g className="cells">
      {currData.map(datum => {
        return (
          <rect
            fill={datum.color}
            height={cellHeight - 0.5}
            key={datum.year + '-' + datum.month}
            onMouseEnter={() => onUpdateCurrDatum(datum)}
            onMouseLeave={() => onUpdateCurrDatum(null)}
            width={cellWidth - 0.5}
            stroke={styleSpex.colorBorders}
            strokeWidth={0.5}
            x={xScale(datum.month)}
            y={yScale(new Date().setFullYear(datum.year - 1))}
          />
        );
      })}
    </g>
  );
}

export default Bars;
