import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setSeen } from 'actions/errors';

const testError = new Error('This is an example error message');

function ErrorPage({ error, errorType, setSeen }) {
  useEffect(() => {
    setSeen(true);
  }, [setSeen]);

  return (
    <>
      <h2>{errorType || 'Unknown'} Error</h2>
      <p>{(error || testError).message}</p>
    </>
  );
}

const mapStateToProps = state => ({
  error: state.error.error,
  errorType: state.error.errorType,
});

export default connect(mapStateToProps, { setSeen })(ErrorPage);
