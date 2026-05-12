// Purpose: Displays the simulation history with Chart.js.
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { IconActivity } from "./Icons";
import { Legend } from "./Legend";
import { formatChartTimeAsSeconds, formatChartTooltipLine, getChartMaxSeconds } from "../simulation/chartHistory";

const CHART_COLORS = {
  healthy: "#43A047",
  infected: "#E53935",
  recovered: "#1E88E5",
};

const HOVER_GUIDE_PLUGIN = {
  id: "hoverGuide",
  afterDraw(chart) {
    const activeElements = chart.tooltip?.getActiveElements() ?? [];

    if (activeElements.length === 0) {
      return;
    }

    const { ctx, chartArea } = chart;
    const x = activeElements[0].element.x;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(245, 245, 245, 0.35)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

const LIVE_EDGE_WIDTH_PIXELS = 28;

// Converts history points into Chart.js datasets while keeping the styling centralized.
const createChartDatasets = (data) => [
  // TODO: Keep this dataset list aligned with INDIVIDUAL_STATES if new states are added.
  {
    label: "Sains",
    data: data.map((item) => ({ x: item.timeSeconds, y: item.healthy })),
    borderColor: CHART_COLORS.healthy,
    backgroundColor: "rgba(67, 160, 71, 0.12)",
    pointBackgroundColor: CHART_COLORS.healthy,
    pointBorderColor: "#172033",
    pointHoverBackgroundColor: CHART_COLORS.healthy,
    pointHoverBorderColor: "#F5F5F5",
    pointHoverBorderWidth: 3,
    pointHoverRadius: 7,
    pointHitRadius: 12,
    pointRadius: 3,
    tension: 0.35,
  },
  {
    label: "Infectés",
    data: data.map((item) => ({ x: item.timeSeconds, y: item.infected })),
    borderColor: CHART_COLORS.infected,
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    pointBackgroundColor: CHART_COLORS.infected,
    pointBorderColor: "#172033",
    pointHoverBackgroundColor: CHART_COLORS.infected,
    pointHoverBorderColor: "#F5F5F5",
    pointHoverBorderWidth: 3,
    pointHoverRadius: 7,
    pointHitRadius: 12,
    pointRadius: 3,
    tension: 0.35,
  },
  {
    label: "Guéris",
    data: data.map((item) => ({ x: item.timeSeconds, y: item.recovered })),
    borderColor: CHART_COLORS.recovered,
    backgroundColor: "rgba(30, 136, 229, 0.12)",
    pointBackgroundColor: CHART_COLORS.recovered,
    pointBorderColor: "#172033",
    pointHoverBackgroundColor: CHART_COLORS.recovered,
    pointHoverBorderColor: "#F5F5F5",
    pointHoverBorderWidth: 3,
    pointHoverRadius: 7,
    pointHitRadius: 12,
    pointRadius: 3,
    tension: 0.35,
  },
];

// Updates existing Chart.js dataset objects so hover state is not reset on each new second.
const updateChartDatasets = (chart, data) => {
  const nextDatasets = createChartDatasets(data);

  chart.data.datasets.forEach((dataset, index) => {
    dataset.data = nextDatasets[index].data;
  });
};

// Returns the live count matching one chart dataset label.
const getLiveCountForDataset = (stats, label) => {
  if (label === "Sains") {
    return stats.healthy;
  }

  if (label === "Infectés") {
    return stats.infected;
  }

  return stats.recovered;
};

// Activates the latest recorded point so the tooltip can display live values there.
const setLatestActiveElements = (chart, data) => {
  const latestIndex = data.length - 1;
  const activeElements = chart.data.datasets.map((_, datasetIndex) => ({
    datasetIndex,
    index: latestIndex,
  }));
  const latestPoint = chart.getDatasetMeta(0).data[latestIndex];

  chart.setActiveElements(activeElements);
  chart.tooltip.setActiveElements(activeElements, {
    x: latestPoint.x,
    y: latestPoint.y,
  });
  chart.draw();
};

// Activates the latest point when the cursor is kept on the right edge of the chart.
const showLatestTooltipIfCursorIsOnRightEdge = (chart, event, data) => {
  if (!event || data.length === 0) {
    return false;
  }

  const { chartArea } = chart;

  if (
    event.x < chartArea.right - LIVE_EDGE_WIDTH_PIXELS
    || event.x > chartArea.right
    || event.y < chartArea.top
    || event.y > chartArea.bottom
  ) {
    return false;
  }

  setLatestActiveElements(chart, data);
  return true;
};

// Renders and updates the line chart for healthy, infected, and recovered counts.
export function EvolutionChart({
  data,
  liveStats = { healthy: 0, infected: 0, recovered: 0, total: 0 },
  liveTimeSeconds = 0,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const dataRef = useRef(data);
  const liveStatsRef = useRef(liveStats);
  const liveTimeSecondsRef = useRef(liveTimeSeconds);
  const isCursorOnLiveEdgeRef = useRef(false);
  const hasData = data.length > 0;

  useEffect(() => {
    // Creates the chart only when the canvas node is available.
    if (!canvasRef.current) {
      return undefined;
    }

    // Chart.js owns its canvas drawing, so the instance is created once and updated later.
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        datasets: createChartDatasets(dataRef.current),
      },
      plugins: [HOVER_GUIDE_PLUGIN],
      options: {
        animation: false,
        interaction: {
          axis: "x",
          intersect: false,
          mode: "index",
        },
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event, _activeElements, chart) => {
          isCursorOnLiveEdgeRef.current = showLatestTooltipIfCursorIsOnRightEdge(
            chart,
            event,
            dataRef.current,
          );
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.96)",
            bodyColor: "#F5F5F5",
            borderColor: "rgba(148, 163, 184, 0.3)",
            borderWidth: 1,
            boxHeight: 10,
            boxWidth: 10,
            enabled: true,
            titleColor: "#F5F5F5",
            callbacks: {
              title: (items) => {
                const timeSeconds = isCursorOnLiveEdgeRef.current
                  ? liveTimeSecondsRef.current
                  : items[0]?.parsed.x ?? 0;

                return `Temps: ${formatChartTimeAsSeconds(timeSeconds)}`;
              },
              label: (context) => {
                const point = dataRef.current[context.dataIndex];
                const total = isCursorOnLiveEdgeRef.current
                  ? liveStatsRef.current.total
                  : point ? point.healthy + point.infected + point.recovered : 0;
                const count = isCursorOnLiveEdgeRef.current
                  ? getLiveCountForDataset(liveStatsRef.current, context.dataset.label)
                  : context.parsed.y;

                return formatChartTooltipLine(context.dataset.label, count, total);
              },
              labelColor: (context) => {
                const color = context.dataset.borderColor;

                return {
                  backgroundColor: color,
                  borderColor: color,
                };
              },
              afterBody: (items) => {
                const point = dataRef.current[items[0]?.dataIndex];
                const total = isCursorOnLiveEdgeRef.current
                  ? liveStatsRef.current.total
                  : point ? point.healthy + point.infected + point.recovered : 0;

                return [`Total: ${total} individus`];
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            grid: { color: "rgba(148, 163, 184, 0.08)" },
            max: getChartMaxSeconds(dataRef.current),
            min: 0,
            ticks: {
              color: "#B0B0B0",
              stepSize: 1,
              callback: (value) => formatChartTimeAsSeconds(value),
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: { color: "rgba(148, 163, 184, 0.08)" },
            ticks: { color: "#B0B0B0" },
          },
        },
      },
    });

    return () => {
      // Cleans up the Chart.js instance when React unmounts the component.
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    liveStatsRef.current = liveStats;
    liveTimeSecondsRef.current = liveTimeSeconds;

    if (isCursorOnLiveEdgeRef.current && chartRef.current && dataRef.current.length > 0) {
      setLatestActiveElements(chartRef.current, dataRef.current);
    }
  }, [liveStats, liveTimeSeconds]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    dataRef.current = data;
    let activeElements = chartRef.current.getActiveElements();
    let tooltipActiveElements = chartRef.current.tooltip?.getActiveElements() ?? [];
    const tooltipPosition = chartRef.current.tooltip
      ? { x: chartRef.current.tooltip.x, y: chartRef.current.tooltip.y }
      : undefined;

    updateChartDatasets(chartRef.current, data);
    chartRef.current.options.scales.x.max = getChartMaxSeconds(data);
    chartRef.current.update("none");

    if (isCursorOnLiveEdgeRef.current && data.length > 0) {
      const latestIndex = data.length - 1;

      activeElements = chartRef.current.data.datasets.map((_, datasetIndex) => ({
        datasetIndex,
        index: latestIndex,
      }));
      tooltipActiveElements = activeElements;
    }

    if (activeElements.length > 0) {
      chartRef.current.setActiveElements(activeElements);
    }

    if (tooltipActiveElements.length > 0) {
      const tooltipTargetIndex = tooltipActiveElements[0].index;
      const tooltipTargetPoint = chartRef.current.getDatasetMeta(0).data[tooltipTargetIndex];

      chartRef.current.tooltip.setActiveElements(
        tooltipActiveElements,
        isCursorOnLiveEdgeRef.current && tooltipTargetPoint
          ? { x: tooltipTargetPoint.x, y: tooltipTargetPoint.y }
          : tooltipPosition,
      );
      chartRef.current.draw();
    }
  }, [data]);

  return (
    <section className="panel chart-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconActivity size={15} />
          </span>
          <div>
            <div className="chart-panel__title-row">
              <h2>Évolution dans le temps</h2>
              <Legend compact />
            </div>
            <p>{hasData ? `${data.length} points enregistrés` : "En attente des données de simulation"}</p>
          </div>
        </div>
      </div>
      <div className="chart-frame">
        <canvas ref={canvasRef} aria-label="Graphique d'évolution des états de la population" />
        {!hasData && <div className="chart-empty-state">Aucune donnée enregistrée</div>}
      </div>
    </section>
  );
}
