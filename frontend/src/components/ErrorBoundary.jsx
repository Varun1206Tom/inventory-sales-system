import React from 'react';
import { Button, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
          <div className="mb-3" style={{ fontSize: '4rem' }}>⚠️</div>
          <h2 className="mb-2">Something went wrong</h2>
          <p className="text-muted mb-4">
            We're sorry. You can try refreshing the page or go back.
          </p>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button variant="outline-secondary" onClick={() => window.location.href = '/'}>
              Go to home
            </Button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
