"use client";
import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{ padding: "8px" }}>
          <h2 style={{ fontSize: "36px" }}>Something went wrong</h2>
          <p>{this.state.error?.message || "Unknown error occurred"}</p>
          <code style={{ fontSize: "10px", lineHeight: "1" }}>
            {this.state.error?.stack}
          </code>
          <span className="snapshot_ready" />
        </div>
      );
    }

    return this.props.children;
  }
}
