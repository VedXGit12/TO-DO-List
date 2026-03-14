import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {this.props.fallbackMessage ?? "Something went wrong"}
          </p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "var(--accent)", color: "var(--bg-base)" }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
