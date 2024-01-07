import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
// import { mockPieData as data } from "../data/mockData";

const PieChart = ({isDashboard}) => {

  const [spaceXData, setSpaceXData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.spacexdata.com/v3/launches");
        const data = await response.json();

        // Extract success and failure data
        const filteredData = data.reduce(
          (acc, { launch_success }) => {
            launch_success ? acc.success++ : acc.failure++;
            return acc;
          },
          { success: 0, failure: 0 }
        );

        console.log("SpaceX Data:", filteredData);
        setSpaceXData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SpaceX data:", error);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 1000);

    // Cleanup the timeout if the component unmounts or data is fetched
    return () => clearTimeout(timeoutId);
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      {loading ? (
        <p>Loading SpaceX data...</p>
      ) : (
        <ResponsivePie
          data={
            spaceXData
              ? [
                  {
                    id: "success",
                    label: "Success",
                    value: spaceXData.success,
                  },
                  {
                    id: "failure",
                    label: "Failure",
                    value: spaceXData.failure,
                  },
                ]
              : []
          }
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100],
                },
              },
              legend: {
                text: {
                  fill: colors.grey[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.grey[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.grey[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={isDashboard ? 0.3 : 0.01}
          padAngle={0.5}
          cornerRadius={3}
          activeOuterRadiusOffset={isDashboard ? 4 : 8}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.grey[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          enableArcLabels={true}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      )}
    </>
  );
};

export default PieChart;
