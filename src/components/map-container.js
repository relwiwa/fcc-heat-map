import React, { Component } from 'react';
import { scaleOrdinal as d3ScaleOrdinal, scaleTime as d3ScaleTime } from 'd3-scale';

import DynamicNonSvgComponents from './dynamic-non-svg-components';
import Legend from './legend';
import StaticSvgComponents from './static-svg-components';

class MapContainer extends Component {
  constructor(props) {
    super(props);

    const { containerWidth, currData, chartSpex: { cellHeight, margins }, maxMinYear } = props;
    this.state = this.calculateStaticMapStateProps(cellHeight, containerWidth, currData, margins, maxMinYear);
  }

  // Update state in response to a props change, i.e. change in container dimensions
  componentWillReceiveProps(nextProps) {
    const { containerWidth, currData } = this.props;

    if (containerWidth !== nextProps.containerWidth) {
      const { containerWidth, currData, chartSpex: { cellHeight, margins }, maxMinYear } = nextProps;
      this.setState(this.calculateStaticMapStateProps(cellHeight, containerWidth, currData, margins, maxMinYear));
    }
  }

  calculateChartHeight(data, margins, cellHeight) {
    return (Math.floor(data.length / 12) + 1) * cellHeight + margins.top + margins.bottom;
  }

  calculateChartWidth(containerWidth) {
    return containerWidth;
  }

  calculateCellWidth(chartWidth, margins) {
    return (chartWidth - margins.left - margins.right) / 12;
  }

  /** @name calculateStaticMapStateProps
   *  @description
   *  - Helper function that creates state object with all containerWidth-dependent
   *    properties that get stored within state and passed on to StaticSvgComponents */
  calculateStaticMapStateProps(cellHeight, containerWidth, currData, margins, maxMinYear) {
    const chartHeight = this.calculateChartHeight(currData, margins, cellHeight)
    const chartWidth = this.calculateChartWidth(containerWidth);
    const cellWidth = this.calculateCellWidth(chartWidth, margins)

    return {
      chartHeight: chartHeight,
      chartWidth: chartWidth,
      cellWidth: cellWidth,
      xScale: this.calculateXScale(chartWidth, margins, cellWidth),
      yScale: this.calculateYScale(chartHeight, margins, maxMinYear),
    };    
  }

  /** @name calculateXScale
   *  @description
   *  - Ordinal scale is used instead of time scale.
   *  - Time scale would scale items according to different lenght of months
   *  - Width of cells would be different for months of different length
   *  - Using ordinal scales simplifies scaling in this aspect  */
  calculateXScale(chartWidth, margins, cellWidth)  {
    const domain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const range = domain.map((item, index) => {
      return margins.left + index * cellWidth;
    });
    return d3ScaleOrdinal()
      .domain(domain)
      .range(range);
  }

  calculateYScale(chartHeight, margins, maxMinYear)  {
    const { maxYear, minYear } = maxMinYear;
    return d3ScaleTime()
      .domain([maxYear, minYear])
      .range([chartHeight - margins.bottom, margins.top]);
  }

  render() {
    const { chartSpex, colorScheme, currData, currDatum, maxMinYear, onUpdateCurrDatum, styleSpex } = this.props;
    const { cellWidth, chartHeight, chartWidth, xScale, yScale } = this.state;

    return (
      <div>
        <div
          style={{height: chartHeight, position: 'relative', width: chartWidth, minWidth: chartWidth}}
        >
          <svg style={{height: chartHeight, width: '100%', minWidth: '100%'}}>
            <StaticSvgComponents
              cellWidth={cellWidth}
              chartHeight={chartHeight}
              chartSpex={chartSpex}
              chartWidth={chartWidth}
              currData={currData}
              onUpdateCurrDatum={onUpdateCurrDatum}
              styleSpex={styleSpex}
              xScale={xScale}
              yScale={yScale}
            />
          </svg>
          {currDatum !== null && <DynamicNonSvgComponents
            cellWidth={cellWidth}
            chartSpex={chartSpex}
            chartWidth={chartWidth}
            currDatum={currDatum}
            xScale={xScale}
            yScale={yScale}
          />}
        </div>
        <Legend
          cellHeight={chartSpex.cellHeight}
          cellWidth={cellWidth}
          chartWidth={chartWidth}
          colorScheme={colorScheme}
          fontSize={styleSpex.fontSizeLegend}
        />
      </div>
    );
  }
}

export default MapContainer;
