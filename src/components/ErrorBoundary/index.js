import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  /**
   * This error boundary wont replace the view, it will just append error info
   * to the top of the view
   */
  render() {
    return (
      <>
        {this.state.errorInfo && (
          <Container style={{ border: '2px solid var(--danger)' }} className="block shadow-sm">
            <Row>
              <Col>
                <h2 className="h3">Something went wrong.</h2>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </details>
              </Col>
            </Row>
          </Container>
        )}
        {this.props.children}
      </>
    );
  }
}

export default ErrorBoundary;
