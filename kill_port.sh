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
