import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  // transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function StockEchange() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStock, setSelectedStock] = useState();
  const [selectedSymbol, setSelectedSymbol] = useState();
  const [stockPrice, setStockPrice] = useState();
  const [stockName, setStockName] = useState();
  const [stockChange, setStockChange] = useState();
  const [stockPercentChange, setStockPercentChange] = useState();
  const [stockOpen, setStockOpen] = useState();
  const [stockHigh, setStockHigh] = useState();
  const [stockLow, setStockLow] = useState();
  const [stockVolume, setStockVolume] = useState();
  const [stockWkHigh, setStockWkHigh] = useState();
  const [stockWkLow, setStockWkLow] = useState();

  const [expanded, setExpanded] = useState(false);

  const STOCK_API = process.env.REACT_APP_STOCK_API;

  const SEARCH_URL = `https://api.twelvedata.com/symbol_search?symbol=${searchInput}`;
  const PRICE_URL = `https://api.twelvedata.com/price?symbol=${selectedSymbol}&apikey=${STOCK_API}`;
  const DETAILS_URL = `https://api.twelvedata.com/quote?symbol=${selectedSymbol}&apikey=${STOCK_API}`;

  //handle search input and get the results
  useEffect(() => {
    fetch(SEARCH_URL)
      .then((res) => res.json())
      .then((resJson) => {
        let searchResultsArray = [];
        let searchResults = resJson.data
          .filter(
            (value, index, self) =>
              index ===
              self.findIndex((_value) => _value.symbol === value.symbol)
          )
          .map((results) => `${results.symbol} - ${results.instrument_name}`);

        searchResultsArray.push(searchResults);
        setSearchResult(...searchResultsArray);
      });
  }, [SEARCH_URL]);

  //gets symbol from selected search result
  useEffect(() => {
    let stockText = selectedStock;
    if (selectedStock) {
      const stringEnd = stockText.indexOf("-") - 1;
      const stockSymbol = stockText.slice(0, stringEnd);
      setSelectedSymbol(stockSymbol);
    } else return;
  }, [selectedStock]);

  //gets price, logo & other details of selected symbol
  useEffect(() => {
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((resJson) => {
        setStockPrice(resJson.price);
      });

    fetch(DETAILS_URL)
      .then((res) => res.json())
      .then((resJson) => {
        setStockName(resJson.name);
        setStockChange(resJson.change);
        setStockPercentChange(resJson.percent_change);
        setStockOpen(resJson.open);
        setStockHigh(resJson.high);
        setStockLow(resJson.low);
        setStockVolume(resJson.volume);
        setStockWkHigh(resJson.fifty_two_week.high);
        setStockWkLow(resJson.fifty_two_week.low);
      });
  }, [PRICE_URL, DETAILS_URL]);

  const handleSearchInput = (event, newValue) => {
    setSearchInput(newValue);
  };

  const handleSearchSelect = (event, newValue) => {
    setSelectedStock(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatNum = (num) => {
    return num.toFixed(2);
  };

  let formattedPrice = formatNum(+stockPrice);
  let formattedPriceChange = formatNum(+stockChange);
  let formattedPercentageChange = formatNum(+stockPercentChange);
  let formattedOpen = formatNum(+stockOpen);
  let formattedHigh = formatNum(+stockHigh);
  let formattedLow = formatNum(+stockLow);
  let formattedWkHigh = formatNum(+stockWkHigh);
  let formattedWkLow = formatNum(+stockWkLow);

  return (
    <Grid2 container>
      <Grid2
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Autocomplete
          id="stocksSearchBar"
          value={selectedStock}
          onChange={handleSearchSelect}
          options={searchResult}
          inputValue={searchInput}
          onInputChange={handleSearchInput}
          getOptionLabel={(option) => option}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Stock symbol: " />
          )}
        />
        {selectedStock ? (
          <Card
            sx={{ maxWidth: 600, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {stockName}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    ${formattedPrice}
                  </Typography>
                  {/*============================= Make color based on green or red ===========================================*/}
                  {stockChange > 0 ? (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "green" }}
                    >
                      +{formattedPriceChange}({formattedPercentageChange})
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "red" }}
                    >
                      {formattedPriceChange}({formattedPercentageChange})
                    </Typography>
                  )}
                </CardContent>
              </Box>
            </Box>
            <CardActions disableSpacing>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="more details"
              >
                {!expanded ? (
                  <Typography variant="caption" gutterBottom>
                    View Details
                  </Typography>
                ) : (
                  <Typography variant="caption" gutterBottom>
                    Hide Details
                  </Typography>
                )}
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 700 }} aria-label="details table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right">Open</TableCell>
                        <TableCell align="right">Volume</TableCell>
                        <TableCell align="right">52 Week range</TableCell>
                        <TableCell align="right">Low</TableCell>
                        <TableCell align="right">High</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedSymbol}</TableCell>
                        <TableCell align="right">{formattedOpen}</TableCell>
                        <TableCell align="right">${stockVolume}</TableCell>
                        <TableCell align="right">
                          {formattedWkLow} - {formattedWkHigh}
                        </TableCell>
                        <TableCell align="right">{formattedLow}</TableCell>
                        <TableCell align="right">{formattedHigh}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>
        ) : (
          ""
        )}
      </Grid2>
    </Grid2>
  );
}
