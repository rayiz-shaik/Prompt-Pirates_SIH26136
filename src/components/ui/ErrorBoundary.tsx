"use client";
import { Component, type ReactNode } from "react";

interface State { error: Error | null }
/** Keeps a failure in one role view from blanking the whole portal; the persona bar stays usable. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="rounded border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-800">This screen could not be displayed.</p>
        <p className="mt-1 text-sm text-red-700">{this.state.error.message}</p>
        <button onClick={() => this.setState({ error: null })} className="mt-3 rounded bg-red-700 px-3 py-1.5 text-white">Reload this screen</button>
      </div>
    );
  }
}
