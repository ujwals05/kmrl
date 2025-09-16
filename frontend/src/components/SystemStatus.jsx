import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const SystemStatus = ({
  status,
  autoRefresh,
  setAutoRefresh,
  onRefresh,
  onGeneratePredictions,
  onClearOverrides,
  loading,
}) => {
  const getStatusColor = (systemStatus) => {
    switch (systemStatus) {
      case "running":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "initializing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (systemStatus) => {
    switch (systemStatus) {
      case "running":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case "error":
        return <ExclamationCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          System Control Panel
        </h2>
        <div className="flex items-center space-x-4">
          {status && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status.status
              )}`}
            >
              {getStatusIcon(status.status)}
              <span className="ml-2 capitalize">{status.status}</span>
            </div>
          )}
        </div>
      </div>

      {/* System Metrics */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {status.trains_count}
            </div>
            <div className="text-sm text-gray-500">Total Trains</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {status.ml_model_trained ? "✓" : "✗"}
            </div>
            <div className="text-sm text-gray-500">ML Model</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {status.optimization_completed ? "✓" : "✗"}
            </div>
            <div className="text-sm text-gray-500">Optimization</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {status.manual_overrides_count}
            </div>
            <div className="text-sm text-gray-500">Overrides</div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading && <div className="loading-spinner mr-2"></div>}
          Refresh Data
        </button>

        <button
          onClick={onGeneratePredictions}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading && <div className="loading-spinner mr-2"></div>}
          Generate Predictions
        </button>

        <button
          onClick={onClearOverrides}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Overrides
        </button>

        <div className="flex items-center ml-auto">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">
              Auto-refresh (5 min)
            </span>
          </label>
        </div>
      </div>

      {/* Last Update */}
      {status?.last_update && (
        <div className="mt-4 text-xs text-gray-500">
          Last updated: {new Date(status.last_update).toLocaleString()}
        </div>
      )}
    </div>
  );

};

export default SystemStatus;
