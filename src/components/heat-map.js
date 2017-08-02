import axios from 'axios';
import React, { Component } from 'react';

import MapContainerWithResizeHandling from './map-container-with-resize-handling';

import SPEX from '../data/heat-map.spex';

const axiosConfig = axios.create({
  timeout: 5000
});

class HeatMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorScheme: [],
      currData: [],
      currDatum: null,
      errorMessage: false,
      maxMinVariance: null,
      maxMinYear: null,
      progressMessage: false,
    }
  }
  
  componentDidMount() {
    this.getData(SPEX.dataUrl);
  }

  calculateColorScheme(maxVariance, colors) {
    const colorInterval = (maxVariance) / 10; 
    const colorScheme = colors.map((color, index) => {
      return {
        color: color,
        start: 0 + index * colorInterval,
        end: (index + 1) * colorInterval
      }
    });

    return {
      colorInterval: colorInterval,
      colorScheme: colorScheme,
    }
  }

  getData(url) {
    axios.get(url)
    .then(
      data => {
        this.prepareData(data.data);
      },
      error => {
        this.setState({
          errorMessage: true,
        });
      }
    );
    this.setState({
      progressMessage: true,
    });
  }

  /** @name prepareData
   *  @description
   *  - sets up minVariance and maxVariance of all data
   *  - splits data up in array containing each month's data */
  prepareData(data) {
    const { baseTemperature, monthlyVariance } = data;

    let tempData = [];
    let minVariance = 1000;
    let maxVariance = 0;
    let minYear = 3000;
    let maxYear = 1000;
    monthlyVariance.map((datum) => {
      if (datum.variance > maxVariance) {
        maxVariance = datum.variance;
      }
      if (datum.variance < minVariance) {
        minVariance = datum.variance;
      }
      if (datum.year < minYear) {
        minYear = datum.year;
      }
      if (datum.year > maxYear) {
        maxYear = datum.year;
      }
      tempData.push(datum);
    });
    minVariance = minVariance + baseTemperature;
    maxVariance = maxVariance + baseTemperature;

    const colorScheme = this.calculateColorScheme(maxVariance, SPEX.chart.colors);
    tempData.map((tempDatum, index) => {
      const x = Math.floor((tempDatum.variance + baseTemperature) / colorScheme.colorInterval);
      tempData[index].color = SPEX.chart.colors[x - 1];
      tempData[index].temperature = tempData[index].variance + baseTemperature;
    });

    this.setState({
      colorScheme: colorScheme,
      currData: tempData,
      maxMinVariance: {
        maxVariance: maxVariance,
        minVariance: minVariance
      },
      maxMinYear: {
        maxYear: new Date().setFullYear(maxYear),
        minYear: new Date().setFullYear(minYear - 1),
      },
      progressMessage: false,
    });
  }
 
  render() {
    const { colorScheme: { colorScheme }, currData, currDatum, errorMessage, maxMinVariance, maxMinYear, progressMessage } = this.state;

    return (
      <div className="heat-map row" style={{marginBottom: 50}}>
        <div className="column small-12 text-center">
          <h1>Map of Global Monthly Temperatures <nobr>1753 - 2015</nobr></h1>
          <p>This map displays the variance of global monthly temperatures. Each month's value is compared to the base temperature of 8.66 °C. This is the average global monthly temperature between January 1951 and December 1980.</p>  
          {errorMessage && <p><b>An error happened while fetching data</b></p>}
          {progressMessage && <p><b><i className="fa fa-spinner fa-spin"></i> Fetching data</b></p>}
          {(!errorMessage && currData.length > 0) && <MapContainerWithResizeHandling
            chartSpex={SPEX.chart}
            colorScheme={colorScheme}
            currData={currData}
            currDatum={currDatum}
            maxMinVariance={maxMinVariance}
            maxMinYear={maxMinYear}
            onUpdateCurrDatum={(datum) => this.setState({ currDatum: datum })}
            styleSpex={SPEX.styles}
          />}
        </div>
      </div>
    );
  }
};

export default HeatMap;
