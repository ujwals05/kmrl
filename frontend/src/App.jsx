import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Header from "./components/Header";
import SystemStatus from "./components/SystemStatus";
import MetricsCards from "./components/MetricsCards";
import ChartsSection from "./components/ChartsSection";

function App() {
  const [trainData, setTrainData] = useState([
    {
      train_id: "Train-101",
      fitness_score: 95,
      depot: "Depot A",
      final_decision: "Induct",
    },
    {
      train_id: "Train-102",  
      fitness_score: 88,
      depot: "Depot B",
      final_decision: "Induct",
    },
    {
      train_id: "Train-103",
      fitness_score: 76,
      depot: "Depot A",
      final_decision: "Reject",
    },
    {
      train_id: "Train-104",
      fitness_score: 65,
      depot: "Depot C",
      final_decision: "Reject",
    },
    {
      train_id: "Train-105",
      fitness_score: 82,
      depot: "Depot B",
      final_decision: "Induct",
    },
    {
      train_id: "Train-106",
      fitness_score: 70,
      depot: "Depot C",
      final_decision: "Pending",
    },
  ]);
  // const [trainData, setTrainData] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    status: "running", // "running" | "error" | "initializing"
    trains_count: 25, // total number of trains
    ml_model_trained: true, // boolean
    optimization_completed: false, // boolean
    manual_overrides_count: 3, // number of overrides
    last_update: "2025-09-17T08:30:00Z", // ISO timestamp string
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // API request helper
  const makeApiRequest = async (endpoint, method = "GET", data = null) => {
    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const status = await makeApiRequest("/status");
      setSystemStatus(status);
    } catch (error) {
      setError("Failed to fetch system status");
    }
  };

  // Fetch train induction data
  const fetchTrainData = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest("/get_induction_list");
      if (response.status === "success") {
        setTrainData(response.induction_list || []);
        setLastUpdate(new Date().toISOString());
      }
    } catch (error) {
      setError("Failed to fetch train data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    try {
      setLoading(true);
      await makeApiRequest("/refresh_data", "GET");
      await fetchTrainData();
      await fetchSystemStatus();
    } catch (error) {
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  // Generate new predictions
  const generatePredictions = async () => {
    try {
      setLoading(true);
      await makeApiRequest("/predict_induction", "POST", {
        use_mock_data: true,
        retrain_model: false,
        target_inductions: 25,
      });
      await fetchTrainData();
    } catch (error) {
      setError("Failed to generate predictions");
    } finally {
      setLoading(false);
    }
  };

  // Apply manual override
  const applyOverride = async (trainId, decision, reason) => {
    try {
      await makeApiRequest("/override_train", "POST", {
        train_id: trainId,
        decision: decision,
        reason: reason,
      });
      await fetchTrainData(); // Refresh data after override
      return true;
    } catch (error) {
      setError("Failed to apply override");
      return false;
    }
  };

  // Clear all overrides
  const clearOverrides = async () => {
    try {
      await makeApiRequest("/clear_overrides", "DELETE");
      await fetchTrainData();
    } catch (error) {
      setError("Failed to clear overrides");
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchTrainData();
        fetchSystemStatus();
      }, 300000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Initial data load
  useEffect(() => {
    fetchSystemStatus();
    fetchTrainData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SystemStatus
            status={systemStatus}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            onRefresh={refreshAllData}
            onGeneratePredictions={generatePredictions}
            onClearOverrides={clearOverrides}
            loading={loading}
          />

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-red-100 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Metrics Cards */}
          <MetricsCards trainData={trainData} />
          {/* Charts Section */}
          <ChartsSection trainData={trainData} />
        </div>
      </div>
    </>
  );
}

export default App;
