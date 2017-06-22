import React, { Component } from 'react';
import { format as d3Format } from 'd3-format';

class Legend extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.chartWidth === nextProps.chartWidth) {
      return false;
    }
    return true;    
  }

  renderLegend() {
    const { cellHeight, cellWidth, chartWidth, colorScheme, fontSize } = this.props;

    let legendItems = [];
    let legendWidth = chartWidth < 650 ? cellWidth * 2 : cellWidth;
    colorScheme.map((item, index) => {
      if (chartWidth < 650 && index === 5) {
        legendItems.push(<br />)
      }
      legendItems.push(
        <span key={item.color} style={{ display: 'inline-block', fontSize: fontSize, width: legendWidth, background: item.color}}>{d3Format('.2r')(item.start)}°C</span>
      );
    });
    return legendItems;
  }

  render () {
    return (
      <div style={{marginTop: 25}}>
        {this.renderLegend()}
      </div>
    );
  }
}

export default Legend;
