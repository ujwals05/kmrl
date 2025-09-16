import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartsSection = ({ trainData = [] }) => {
  // Fitness Score Chart
  const fitnessChart = {
    labels: trainData.map((t) => t.train_id),
    datasets: [
      {
        label: "Fitness Score",
        data: trainData.map((t) => t.fitness_score || 0),
        backgroundColor: trainData.map((t) =>
          t.final_decision === "Induct" ? "#10b981" : "#ef4444"
        ),
      },
    ],
  };

  // Depot Distribution Chart
  const depotCounts = trainData.reduce((acc, t) => {
    acc[t.depot || "Unknown"] = (acc[t.depot || "Unknown"] || 0) + 1;
    return acc;
  }, {});
  const depotChart = {
    labels: Object.keys(depotCounts),
    datasets: [
      {
        data: Object.values(depotCounts),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  // Decision Summary Chart
  const decisionCounts = trainData.reduce((acc, t) => {
    acc[t.final_decision || "Unknown"] =
      (acc[t.final_decision || "Unknown"] || 0) + 1;
    return acc;
  }, {});
  const decisionChart = {
    labels: Object.keys(decisionCounts),
    datasets: [
      {
        data: Object.values(decisionCounts),
        backgroundColor: ["#10b981", "#ef4444", "#6b7280"],
      },
    ],
  };

  // Fleet Health Overview
  const avgFitness =
    trainData.length > 0
      ? (
          trainData.reduce((sum, t) => sum + (t.fitness_score || 0), 0) /
          trainData.length
        ).toFixed(1)
      : 0;

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Fitness Score Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Train Fitness Scores</h3>
        <div className="h-80">
          <Bar data={fitnessChart} options={chartOptions} />
        </div>
      </div>

      {/* Depot Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">
          Train Distribution by Depot
        </h3>
        <div className="h-80">
          <Pie data={depotChart} options={chartOptions} />
        </div>
      </div>

      {/* Decision Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">
          Induction Decision Summary
        </h3>
        <div className="h-80">
          <Doughnut data={decisionChart} options={chartOptions} />
        </div>
      </div>

      {/* Fleet Health */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Fleet Health Overview</h3>
        <div className="space-y-2 text-sm">
          <p>
            Excellent (90%+):{" "}
            {trainData.filter((t) => t.fitness_score >= 90).length} trains
          </p>
          <p>
            Good (80-89%):{" "}
            {
              trainData.filter(
                (t) => t.fitness_score >= 80 && t.fitness_score < 90
              ).length
            }{" "}
            trains
          </p>
          <p>
            Fair (70-79%):{" "}
            {
              trainData.filter(
                (t) => t.fitness_score >= 70 && t.fitness_score < 80
              ).length
            }{" "}
            trains
          </p>
          <p>
            Poor (&lt;70%):{" "}
            {trainData.filter((t) => t.fitness_score < 70).length} trains
          </p>
          <hr />
          <p className="font-semibold">Average Fleet Fitness: {avgFitness}%</p>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
