import FxExhange from "./components/fxExhange";
import StockExchange from "./components/stockExchange";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

function App() {
  const [value, setValue] = useState("1");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        xs={12}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="conversion tool switch"
              textColor="secondary"
              indicatorColor="secondary"
              centered
            >
              <Tab label="Forex" value={"1"} />
              <Tab label="Stocks" value={"2"} />
            </TabList>
          </Box>
          <TabPanel value={"1"} index={0}>
            <FxExhange />
          </TabPanel>
          <TabPanel value={"2"} index={0}>
            <StockExchange />
          </TabPanel>
        </TabContext>
      </Grid2>
    </Grid2>
  );
}

export default App;
