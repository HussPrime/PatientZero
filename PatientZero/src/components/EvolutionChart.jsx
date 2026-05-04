import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { IconActivity } from "./Icons";
import { Legend } from "./Legend";

export function EvolutionChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((item) => item.tick),
        datasets: [
          {
            label: "Sains",
            data: data.map((item) => item.healthy),
            borderColor: "#43A047",
            backgroundColor: "rgba(67, 160, 71, 0.12)",
            tension: 0.35,
          },
          {
            label: "Infectés",
            data: data.map((item) => item.infected),
            borderColor: "#E53935",
            backgroundColor: "rgba(229, 57, 53, 0.12)",
            tension: 0.35,
          },
          {
            label: "Guéris",
            data: data.map((item) => item.recovered),
            borderColor: "#1E88E5",
            backgroundColor: "rgba(30, 136, 229, 0.12)",
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            grid: { color: "rgba(148, 163, 184, 0.08)" },
            ticks: { color: "#B0B0B0" },
            min: 0,
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
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <section className="panel chart-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconActivity size={15} />
          </span>
          <div>
            <h2>Évolution dans le temps</h2>
            <p>En attente des données de simulation</p>
          </div>
        </div>
        <Legend compact />
      </div>
      <div className="chart-frame">
        <canvas ref={canvasRef} aria-label="Graphique d'évolution temporaire" />
        {data.length === 0 && <div className="chart-empty-state">Aucune donnée enregistrée</div>}
      </div>
    </section>
  );
}
