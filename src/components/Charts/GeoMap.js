import React, { useState, useEffect, Fragment } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv } from 'd3-fetch';
import dummy from './dummydata.csv'; // THIS IS DUMMY DATA CREATED BY JACKIE!! PLEASE DO NOT USE OTHER THAN TEST PURPOSE
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const colorScale = scaleQuantize()
  .domain([1, 20])
  .range(['#8f99f5', '#8089DC', '#727AC4', '#646BAB', '#555B93', '#474C7A', '#393D62']);

const GeoMap = () => {
  const [data, setData] = useState([]);
  const [state, selectState] = useState('Not Selected');
  useEffect(() => {
    // THIS DATA IS DUMMY DATA, DO NOT USE OTHER THAN TESTING PURPOSE (NUMBERS ARE RANDOMLY GENERATED, NOTHING TO DO WITH ACTUAL UNEMPLOYMENT)
    csv(dummy).then(states => {
      setData(states);
    });
  }, []);

  return (
    <Fragment>
      <h1>State Selected: {state}</h1>

      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(data => data.id === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.unemployment_rate : '#EEE')}
                  onClick={() => {
                    selectState(cur.state);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </Fragment>
  );
};

export default GeoMap;
