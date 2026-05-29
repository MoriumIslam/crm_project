import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">An error occurred</h2>
          <pre className="whitespace-pre-wrap text-sm text-red-700 mb-4">{error && error.toString()}</pre>
          {info && info.componentStack && (
            <details className="text-xs text-slate-600">
              <summary>Component stack</summary>
              <pre className="whitespace-pre-wrap">{info.componentStack}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
