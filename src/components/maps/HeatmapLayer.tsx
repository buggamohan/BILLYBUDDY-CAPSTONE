import React from 'react';
import { Rectangle } from 'react-leaflet';
import { Report } from '../../types';
import * as turf from '@turf/turf';

interface HeatmapLayerProps {
  reports: Report[];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ reports }) => {
  // Create a grid of cells covering India
  const bounds = {
    north: 35.513327,
    south: 6.4626999,
    east: 97.395561,
    west: 68.1766451,
  };

  const cellSize = 1; // Size of each grid cell in degrees
  const grid: { bounds: [[number, number], [number, number]]; count: number }[] = [];

  for (let lat = bounds.south; lat < bounds.north; lat += cellSize) {
    for (let lng = bounds.west; lng < bounds.east; lng += cellSize) {
      const cell = {
        bounds: [[lat, lng], [lat + cellSize, lng + cellSize]] as [[number, number], [number, number]],
        count: 0
      };

      // Count reports in this cell
      reports.forEach(report => {
        if (
          report.location.lat >= cell.bounds[0][0] &&
          report.location.lat < cell.bounds[1][0] &&
          report.location.lng >= cell.bounds[0][1] &&
          report.location.lng < cell.bounds[1][1]
        ) {
          cell.count++;
        }
      });

      if (cell.count > 0) {
        grid.push(cell);
      }
    }
  }

  const maxCount = Math.max(...grid.map(cell => cell.count));

  return (
    <>
      {grid.map((cell, index) => {
        const opacity = cell.count / maxCount * 0.7;
        return (
          <Rectangle
            key={index}
            bounds={cell.bounds}
            pathOptions={{
              color: '#ff0000',
              weight: 0,
              fillOpacity: opacity,
              fillColor: '#ff0000'
            }}
          />
        );
      })}
    </>
  );
};

export default HeatmapLayer;