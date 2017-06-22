import React from 'react';

import MapContainer from './map-container';
import withResizeHandling from '../hoc/with-resize-handling';

import SPEX from '../data/heat-map.spex';

const MapContainerWithResizeHandling = withResizeHandling(
  MapContainer,
  SPEX.chart.ratioFactor
);

export default MapContainerWithResizeHandling;
