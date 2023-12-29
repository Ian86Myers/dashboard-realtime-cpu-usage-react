import { Box } from "@mui/material";
import Header from "../../components/Header";
import CpuLineChart from "../../components/LineChart";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <CpuLineChart />
      </Box>
    </Box>
  );
};

export default Line;