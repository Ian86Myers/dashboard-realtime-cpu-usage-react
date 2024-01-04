#!/bin/bash
# Get the port number from the command line argument
port=$1

# Check if the port number is provided
if [ -z "$port" ]; then
  echo "Please provide a port number."
  exit 1
fi

# Get the PID of the process using the specified port
pid=$(lsof -t -i :"$port")

# Check if the PID is not empty
if [ -n "$pid" ]; then
  # Kill the process using the PID
  kill -9 "$pid"
  echo "Process with PID $pid killed."
else
  echo "No process found using port $port."
fi

# one big old npm , eh?
#npm i @mui/material @emotion/react @emotion/styled @mui/x-data-grid @mui/icons-material react-router-dom@6 react-pro-sidebar formik yup  @fullcalendar/core   @fullcalendar/daygrid   @fullcalendar/timegrid @fullcalendar/list