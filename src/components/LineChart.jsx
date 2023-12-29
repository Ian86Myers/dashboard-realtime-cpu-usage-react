// Import necessary libraries
import io from "socket.io-client";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { tokens } from "../theme";

// Create a socket connection to the server
let socket = io("http://localhost:3002", {
  transports: ["websocket", "polling"],
});

// Component for real-time CPU usage line chart
const CpuLineChart = ({}) => {
  // State for storing CPU data points
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const [isServerReset, setIsServerReset] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(true);

  // Function to handle starting/stopping the server
  const handleToggleServer = () => {
    // If the server is currently running, close the socket connection
    if (isServerRunning) {
      socket.close();
    } else {
      // If the server is not running, create a new socket connection
      const newSocket = io("http://localhost:3002", {
        transports: ["websocket", "polling"],
      });

      // Event listener for the "cpu" event from the server
      newSocket.on("cpu", (cpuData) => {
        if (isServerReset) {
          setData([
            {
              ...cpuData,
              name: 0, // Reset the time to zero seconds
            },
          ]);

          setIsServerReset(false);
        } else {
          // If not resetting, update the chart as usual
          setData((currentData) => {
            const roundedTime = cpuData.name.toFixed(0);

            return [
              ...currentData,
              {
                ...cpuData,
                name: parseFloat(roundedTime), // Convert back to a float
              },
            ];
          });
        }
      });
      socket = newSocket;
    }

    // Toggle the server running state
    setIsServerRunning((prevStatus) => !prevStatus);
  };


  const handleClearData = () => {
    setIsServerReset(true);
  };

  // Listen for a cpu event and update the state
  useEffect(() => {
    // Event listener for the "cpu" event from the server
    socket.on("cpu", (cpuData) => {
      if (isServerReset) {
        setData([
          {
            ...cpuData,
            name: 0, // Reset the time to zero seconds
          },
        ]);
        setIsServerReset(false);
      } else {
        // If not resetting, update the chart as usual
        setData((currentData) => {
          const roundedTime = cpuData.name.toFixed(0);
          return [
            ...currentData,
            {
              ...cpuData,
              name: parseFloat(roundedTime), // Convert back to a float
            },
          ];
        });
      }
    });

    // Cleanup socket event listener when the component unmounts
    return () => {
      socket.off("cpu");
    };
  }, [isServerReset]);

  // Render the line chart using the state
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color={colors.greenAccent[500]}
          ml={2}
        >
          Real Time CPU Usage
        </Typography>
        {/* Button to toggle server */}
        <div>
          <Button
            onClick={handleToggleServer}
            variant="contained"
            color={isServerRunning ? "secondary" : "primary"}
          >
            {isServerRunning ? "Stop Server" : "Start Server"}
          </Button>
          {/* Button to clear data */}
          <Button
            onClick={handleClearData}
            variant="contained"
            color="secondary"
          >
            Clear Data
          </Button>
        </div>
      </Box>
      <Box width="100%">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={1024} height={300} data={data}>
            <XAxis dataKey="name" unit="s">
              <Label value="Time" position="bottom" />
            </XAxis>
            <YAxis domain={[0, 100]}>
              <Label value="CPU %" angle={-90} position="insideLeft" />
            </YAxis>
            <Line dataKey="value" />
            <Tooltip labelFormatter={(value) => `${value}s`} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CpuLineChart;
