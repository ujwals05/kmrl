import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import SystemStatus from "./components/SystemStatus";

const API_BASE_URL = 5000;

function App() {
  const [trainData, setTrainData] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
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
      <div className="min-h-screen bg-gray-50">
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
        </div>
      </div>
    </>
  );
}

export default App;
