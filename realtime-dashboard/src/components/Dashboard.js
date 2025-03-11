import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://data-visualization-dashboard-9g3b.onrender.com/data");
        const result = await response.json();
        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", padding: "20px" }}>
      <h2>Real-Time Data Visualization</h2>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ width: "48%", height: 400 }}>
          <h3>Line Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Temperature" stroke="#ff7300" />
              <Line type="monotone" dataKey="PM2.5" stroke="#387908" />
              <Line type="monotone" dataKey="Humidity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: "48%", height: 400 }}>
          <h3>Bar Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="PM2.5" fill="#8884d8" />
              <Bar dataKey="PM10" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div style={{ width: 400, height: 400 }}>
          <h3>Pie Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="Humidity" nameKey="Time" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
