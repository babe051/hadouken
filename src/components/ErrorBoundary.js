import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary component to catch React errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    // In production, you would log to an error reporting service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="error-boundary"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: '#fff'
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Oops!</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Something went wrong. Don't worry, this is not a Konami Code issue!
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              background: '#ffeb3b',
              color: '#333',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;

