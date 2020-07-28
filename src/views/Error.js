import React from 'react';
import { connect } from 'react-redux';

const testError = new Error('This is an example error message');

function ErrorPage({ error, errorType }) {
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

export default connect(mapStateToProps)(ErrorPage);
