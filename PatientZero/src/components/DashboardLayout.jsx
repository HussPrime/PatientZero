// Purpose: Defines the main dashboard regions without owning simulation logic.
import { centerAndHighlightSection } from "../utils/sectionNavigation";

const INTERACTIVE_SECTION_TARGETS = [
  "a",
  "button",
  "canvas",
  "input",
  "label",
  "select",
  "textarea",
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Centers a section when the user clicks on its non-interactive surface.
const handleSectionSurfaceClick = (sectionId) => (event) => {
  if (event.target.closest(INTERACTIVE_SECTION_TARGETS)) {
    return;
  }

  centerAndHighlightSection(sectionId);
};

// Renders the page layout from slots provided by App.
export function DashboardLayout({ header, stats, simulation, chart, controls, liveSettings, setup }) {
  return (
    <div className="app-shell">
      {header}
      <main className="dashboard">
        <section className="dashboard__stats" id="stats" onClick={handleSectionSurfaceClick("stats")}>
          {stats}
        </section>

        <section className="dashboard__main">
          <div className="dashboard__content">
            <div className="dashboard__visuals">
              <div id="simulation" onClick={handleSectionSurfaceClick("simulation")}>
                {simulation}
              </div>
              <div id="chart" onClick={handleSectionSurfaceClick("chart")}>
                {chart}
              </div>
            </div>
            <section className="dashboard__setup" id="setup" onClick={handleSectionSurfaceClick("setup")}>
              {setup}
            </section>
          </div>
          <aside className="dashboard__sidebar">
            <div id="controls" onClick={handleSectionSurfaceClick("controls")}>
              {controls}
            </div>
            <div id="live-settings" onClick={handleSectionSurfaceClick("live-settings")}>
              {liveSettings}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
