import React from 'react';
import { timeFormat as d3TimeFormat } from 'd3-time-format';
import { format as d3Format } from 'd3-format';

const Tooltip = (props) => {
  const { cellWidth, chartSpex: { margins }, chartWidth, currDatum: { color, month, temperature, variance, year }, xScale, yScale } = props;
  const tooltipWidth = 170;
  const degreesFormat = d3Format('+.2r');

  const calculatePositionLeft = () => {
    let positionLeft = xScale(month) + cellWidth * 1.1;
    if (positionLeft + tooltipWidth > chartWidth - margins.right) {
      positionLeft = positionLeft - cellWidth * 1.2 - tooltipWidth;
    }
    return positionLeft;
  }

  return (
    <div
      className="callout"
      style={{position: 'absolute', left: calculatePositionLeft(), top: yScale(new Date().setFullYear(year - 1)) - 1.7 * margins.bottom, width: tooltipWidth, background: color, fontSize: '14px'}}
    >
      <h6>{d3TimeFormat('%B')(new Date(2000, month - 1, 1))} {year}</h6>
      <p>
        Temperature: {d3Format('.2r')(temperature)}°C<br />
        Variance: {d3Format('+.2r')(variance)}°C
      </p>
    </div>
  );
}

export default Tooltip;
