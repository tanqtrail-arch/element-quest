import { Component } from 'react'
import ElementQuest from './components/ElementQuest'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a1a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'sans-serif',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>エラーが発生しました</h1>
          <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              background: '#f59e0b',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            リロードする
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ElementQuest />
    </ErrorBoundary>
  )
}
