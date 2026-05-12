// Purpose: Defines the main dashboard regions without owning simulation logic.
// Renders the page layout from slots provided by App.
export function DashboardLayout({ header, stats, simulation, chart, controls, liveSettings, setup }) {
  return (
    <div className="app-shell">
      {header}
      <main className="dashboard">
        <section className="dashboard__stats" id="stats">{stats}</section>

        <section className="dashboard__main">
          <div className="dashboard__content">
            <div className="dashboard__visuals">
              <div id="simulation">{simulation}</div>
              <div id="chart">{chart}</div>
            </div>
            <section className="dashboard__setup" id="setup">{setup}</section>
          </div>
          <aside className="dashboard__sidebar">
            <div id="controls">{controls}</div>
            <div id="live-settings">{liveSettings}</div>
          </aside>
        </section>
      </main>
    </div>
  );
}
