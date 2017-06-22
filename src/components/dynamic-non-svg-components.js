import React from 'react';

import Tooltip from './tooltip';


/** @class DynamicNonSvgComponents
 *  @description
 *  - Contains all components that:
 *    - Get rendered outside the SVG Object
 *    - Do not solely depend on chart dimensions (chartWidth),
 *      but also on currDatum
 *  - Render is necessary when:
 *    - currDatum changes
 *    - Chart dimensions change  */
const DynamicNonSvgComponents = (props) => {
  const { cellWidth, chartSpex, chartWidth, currDatum, xScale, yScale } = props;

  return (
    <div style={{position: 'absolute', top: 0, left: 0, background: 'green'}}>
      <Tooltip
        cellWidth={cellWidth}
        chartSpex={chartSpex}
        chartWidth={chartWidth}
        currDatum={currDatum}
        xScale={xScale}
        yScale={yScale}
      />
    </div>
  );
}

export default DynamicNonSvgComponents;
