import React, { Component } from 'react';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft, axisRight as d3AxisRight, axisTop as d3AxisTop } from 'd3-axis';
import { timeFormat as d3TimeFormat } from 'd3-time-format';

import Axis from './axis';
import Cells from './cells';

/** @class StaticSvgComponents
 *  @description
 *  - Contains all components that:
 *    - Get rendered to SVG Object
 *    - Depend on chart dimensions (chartWidth)
 *  - Render is only necessary when:
 *    - Component mounts
 *    - Chart dimensions change */
class StaticSvgComponents extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.chartWidth === nextProps.chartWidth) {
      return false;
    }
    return true;
  }

  render() {
    const { cellWidth, chartHeight, chartWidth, chartSpex: { cellHeight, margins }, currData, onUpdateCurrDatum, styleSpex, xScale, yScale } = this.props;

    const xAxisTickFormat = chartWidth < 450
      ? null
      : (d) => d3TimeFormat('%b')(new Date(2000, d - 1, 1));
    const xAxisTicks = 5 * chartWidth * 0.001;
    const yAxisTickFormat = d3TimeFormat('%Y');
    const yAxisTicks = 30 * chartWidth * 0.001;

    return (
      <g>
        <Axis
          axisFunction={d3AxisLeft}
          fontSize={styleSpex.fontSizeAxis}
          orient="left"
          scale={yScale}
          ticks={yAxisTicks}
          tickFormat={yAxisTickFormat}
          tickSizeOuter={0}
          translate={`translate(${margins.left}, 0)`}
        />
        <Axis
          axisFunction={d3AxisRight}
          fontSize={styleSpex.fontSizeAxis}
          orient="right"
          scale={yScale}
          ticks={yAxisTicks}
          tickFormat={yAxisTickFormat}
          tickSizeOuter={0}
          translate={`translate(${chartWidth - margins.right}, 0)`}
        />
        <Axis
          axisFunction={d3AxisTop}
          fontSize={styleSpex.fontSizeAxis}
          orient="top"
          scale={xScale}
          tickFormat={xAxisTickFormat}
          ticks={xAxisTicks}
          tickSizeOuter={0}
          translate={`translate(${cellWidth/2}, ${margins.top})`}
        />
        <Axis
          axisFunction={d3AxisBottom}
          fontSize={styleSpex.fontSizeAxis}          
          orient="bottom"
          scale={xScale}
          tickFormat={xAxisTickFormat}
          ticks={xAxisTicks}
          tickSizeOuter={0}
          translate={`translate(${cellWidth/2}, ${chartHeight - margins.bottom - 1})`}
        />
        <Cells
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          currData={currData}
          margins={margins}
          onUpdateCurrDatum={onUpdateCurrDatum}
          styleSpex={styleSpex}
          xScale={xScale}
          yScale={yScale}

        />
      </g>
    );
  }
}

export default StaticSvgComponents;
