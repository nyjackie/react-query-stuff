import React, { Fragment } from 'react';
import { LineChart, Editable, Social } from 'gdd-components';
import { MONTHS_SHORT } from 'utils/constants';

const Fundraise = () => {
  return (
    <Fragment>
      <Social />
      <br />
      <Editable label="Name" editMode={true} name="name">
        <h2>hello</h2>
      </Editable>
      <LineChart
        responsive
        data={[0, 0, 0.1, 0.2, 0.25, 0.3, 0.5, 0.6, 0.57, 0.75, 1.2, 1.9]}
        labels={MONTHS_SHORT}
        color="green"
        ariaLabel="Donation growth in the last 12 months"
      />
    </Fragment>
  );
};

export default Fundraise;
