// PageAnalytics.js
import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const PageAnalytics = ({ size = "40" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store unique visitors and page views
  const [uniqueVisitors, setUniqueVisitors] = useState([]);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    // Retrieve the current unique visitors and page views from local storage
    const storedUniqueVisitors =
      JSON.parse(localStorage.getItem("uniqueVisitors")) || [];
    const storedPageViews = localStorage.getItem("pageViews");

    // Check if the current visitor is unique
    const currentVisitorId = getVisitorId();
    const isUniqueVisitor = !storedUniqueVisitors.includes(currentVisitorId);

    // Update unique visitors if the current visitor is unique
    if (isUniqueVisitor) {
      setUniqueVisitors([...storedUniqueVisitors, currentVisitorId]);
      localStorage.setItem(
        "uniqueVisitors",
        JSON.stringify([...storedUniqueVisitors, currentVisitorId])
      );
    }

    // Update page views
    const initialPageViews = parseInt(storedPageViews) || 0;
    setPageViews(initialPageViews + 1);
    localStorage.setItem("pageViews", initialPageViews + 1);
  }, []);

  // Function to generate a unique visitor identifier
  const getVisitorId = () => {
    const existingVisitorId = localStorage.getItem("visitorId");
    if (existingVisitorId) {
      return existingVisitorId;
    } else {
      const newVisitorId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem("visitorId", newVisitorId);
      return newVisitorId;
    }
  };

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg 360deg, ${colors.blueAccent[500]} 0deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: colors.grey[100],
      }}
    >
      Unique Visitors: {uniqueVisitors.length} | Page Views: {pageViews}
    </Box>
  );
};

export default PageAnalytics;
