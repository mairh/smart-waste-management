"use client";

import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Reading {
  timestamp: string;
  fullness_level: number;
}

interface RechartProps {
  deviceId: string;
  readings: Reading[];
}

const Rechart: React.FC<RechartProps> = ({ deviceId, readings }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        width={500}
        height={300}
        data={readings}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => {
            const date = new Date(timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="fullness_level"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Rechart;
