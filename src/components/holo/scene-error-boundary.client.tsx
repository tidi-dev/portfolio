"use client";

import { Component, type ReactNode } from "react";

interface SceneErrorBoundaryProps {
  readonly children: ReactNode;
  /** The scene failed to load or render: the stage keeps its poster. */
  readonly onError: () => void;
}

interface SceneErrorBoundaryState {
  readonly failed: boolean;
}

/**
 * Catches a scene's render or chunk-load error so it never reaches the
 * page (contrib-engineering §5.2 step 5); the poster underneath stays.
 */
export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  override state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(): void {
    this.props.onError();
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
