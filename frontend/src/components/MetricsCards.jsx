import React from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const MetricsCards = ({ trainData }) => {
  const getMetrics = () => {
    if (!trainData || trainData.length === 0) {
      return {
        inductedCount: 0,
        heldCount: 0,
        avgFitness: 0,
        activeWorkOrders: 0,
      };
    }

    const inductedCount = trainData.filter(
      (train) => train.final_decision === "Induct"
    ).length;
    const heldCount = trainData.filter(
      (train) => train.final_decision === "Hold"
    ).length;
    const avgFitness =
      trainData.reduce((sum, train) => sum + (train.fitness_score || 0), 0) /
      trainData.length;
    const activeWorkOrders = trainData.reduce(
      (sum, train) => sum + (train.open_work_orders || 0),
      0
    );

    return {
      inductedCount,
      heldCount,
      avgFitness: avgFitness.toFixed(1),
      activeWorkOrders,
    };
  };

  const metrics = getMetrics();

  const cards = [
    {
      title: "Trains to Induct",
      value: metrics.inductedCount,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Ready for service",
    },
    {
      title: "Trains to Hold",
      value: metrics.heldCount,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Maintenance required",
    },
    {
      title: "Average Fitness",
      value: `${metrics.avgFitness}%`,
      icon: BoltIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Fleet health score",
    },
    {
      title: "Active Work Orders",
      value: metrics.activeWorkOrders,
      icon: WrenchScrewdriverIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Pending maintenance",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 metric-card"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-md ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.value}
                </h3>
              </div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </div>

          {/* Progress bar for fitness score */}
          {card.title === "Average Fitness" && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, parseFloat(metrics.avgFitness))
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
