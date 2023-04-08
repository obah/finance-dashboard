import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import TRANSPARENT from "../assets/transparent.png";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
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
  const [stockLogoUrl, setStockLogoUrl] = useState();

  const [expanded, setExpanded] = useState(false);

  const STOCK_API = process.env.REACT_APP_STOCK_API;

  const SEARCH_URL = `https://api.twelvedata.com/symbol_search?symbol=${searchInput}`;
  const PRICE_URL = `https://api.twelvedata.com/price?symbol=${selectedSymbol}&apikey=${STOCK_API}`;
  const LOGO_URL = `https://api.twelvedata.com/logo?symbol=${selectedSymbol}&apikey=${STOCK_API}`;
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

    fetch(LOGO_URL)
      .then((res) => res.json())
      .then((resJson) => setStockLogoUrl(resJson.url));

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
  }, [PRICE_URL, LOGO_URL, DETAILS_URL]);

  //TODO Use async and promises to fix the image and other details loading
  let IMG_URL;

  if (stockLogoUrl) {
    IMG_URL = stockLogoUrl;
  } else {
    IMG_URL = TRANSPARENT;
  }

  const handleSearchInput = (event, newValue) => {
    setSearchInput(newValue);
  };

  const handleSearchSelect = (event, newValue) => {
    setSelectedStock(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
            sx={{ maxWidth: 500, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="50"
                  Image={IMG_URL}
                  alt="Stock/Company logo"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {stockName}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    ${stockPrice}
                  </Typography>
                  {/*============================= Make color based on green or red ===========================================*/}
                  {stockChange > 0 ? (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "green" }}
                    >
                      {stockChange}({stockPercentChange})
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ color: "red" }}
                    >
                      {stockChange}({stockPercentChange})
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
                aria-label="view details"
              >
                <Typography variant="caption" gutterBottom>
                  View Details
                </Typography>
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="body2" gutterBottom>
                  Stock Open: {stockOpen}
                  Stock Low: {stockLow}
                  Stock High: {stockHigh}
                  Stock Volume: {stockVolume}
                  stock 52-Wk High: {stockWkHigh}
                  stock 52-Wk Low: {stockWkLow}
                </Typography>
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
