// Purpose: Defines the main dashboard regions without owning simulation logic.
// Renders the page layout from slots provided by App.
export function DashboardLayout({ header, stats, simulation, chart, controls, liveSettings, setup }) {
  return (
    <div className="app-shell">
      {header}
      <main className="dashboard">
        <section className="dashboard__stats">{stats}</section>

        <section className="dashboard__main">
          <div className="dashboard__content">
            <div className="dashboard__visuals">
              {simulation}
              {chart}
            </div>
            <section className="dashboard__setup">{setup}</section>
          </div>
          <aside className="dashboard__sidebar">
            {controls}
            {liveSettings}
          </aside>
        </section>
      </main>
    </div>
  );
}
