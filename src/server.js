const http = require("http");
const os = require("os-utils");
const io = require("socket.io");

// Function to start the server
function startServer(port) {
  const server = http.createServer();
  const socketIO = io(server, {
    transports: ["websocket", "polling"],
  });

  let startTime = Date.now(); // Record the start time

  // Listen for socket connections
  socketIO.on("connection", (client) => {
    setInterval(() => {
      // Every second, emit a 'cpu' event to the user
      os.cpuUsage((cpuPercent) => {
        // Multiply cpuPercent by 100 to convert it to a percentage in the range of 0-100
        cpuPercent = (cpuPercent * 100).toFixed(2);
        // Calculate the time elapsed in seconds
        const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;

        client.emit("cpu", {
          name: elapsedTimeInSeconds,
          value: cpuPercent,
        });
      });
    }, 1000);
  });

  // Start the server on the specified port
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Return the server instance
  return server;
}

// Function to stop the server
function stopServer(server) {
  if (server) {
    server.close(() => {
      console.log("Server stopped");
    });
  }
}

// Start the server on port 3002
const serverInstance = startServer(3002);

// Uncomment the line below to stop the server after a certain time (for testing purposes)
// setTimeout(() => stopServer(serverInstance), 5000);
