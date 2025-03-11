import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1L2rmaklLE-NFDdGNbQqkiHnJPCe08qguo2tEOX5oaNY/edit?usp=sharing"; // Replace with actual CSV link

export default function Dashboard() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(SHEET_URL);
      const rows = response.data.split("\n").slice(1); // Skip header row
      const formattedData = rows.map(row => {
        const [timestamp, value] = row.split(",");
        return { timestamp, value: parseFloat(value) };
      });
      setData(formattedData.slice(-10)); // Keep last 10 data points
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Data Visualization</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
