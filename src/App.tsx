import { useEffect, useState } from "react";
import { MetricCard } from "./components/MetricCard";
import { getAppInfo, type AppInfo, type BackendResult } from "./lib/backend";
import "./App.css";

type InfoState = { status: "loading" } | BackendResult<AppInfo>;

function BackendStatus({ state }: { state: InfoState }) {
  if ("status" in state) {
    return <div className="app__info">Connecting to backend…</div>;
  }
  if (state.ok) {
    const { name, version, os, arch } = state.data;
    return (
      <div className="app__info app__info--ok" data-testid="backend-status">
        {name} v{version} · {os}/{arch}
      </div>
    );
  }
  const tone = state.reason === "no-backend" ? "warn" : "error";
  return (
    <div className={`app__info app__info--${tone}`} data-testid="backend-status" role="status">
      {state.message}
    </div>
  );
}

export default function App() {
  const [info, setInfo] = useState<InfoState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getAppInfo().then((result) => {
      if (!cancelled) setInfo(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <h1 className="app__brand">Lumo</h1>
          <p className="app__tagline">Local-first, read-only system monitor.</p>
        </div>
        <BackendStatus state={info} />
      </header>

      <div className="app__grid">
        <MetricCard label="CPU" accent="cyan" description="Per-core and total utilisation." />
        <MetricCard label="Memory" accent="violet" description="Physical and committed memory." />
        <MetricCard label="Disk" accent="green" description="Volume usage and throughput." />
        <MetricCard label="Network" accent="amber" description="Adapter throughput." />
      </div>

      <p className="app__notice">
        <strong>Milestone 1.</strong> Live monitoring is not implemented. The cards above are placeholders and show no
        data.
      </p>
    </main>
  );
}
