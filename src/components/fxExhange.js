import AssetRow from "./assetRow";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";

export default function FxExhange() {
  const [amount, setAmount] = useState(1);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [primaryCurrency, setPrimaryCurrency] = useState("USD");
  const [secondaryCurrency, setSecondaryCurrency] = useState("AED");
  const [amountFromPrimary, setAmountFromPrimary] = useState(true);
  const [rate, setRate] = useState();

  const API_KEY = process.env.REACT_APP_FX_API;
  const CURRENCY_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
  const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${primaryCurrency}/${secondaryCurrency}`;

  const formatNum = (num) => {
    return num.toFixed(2);
  };

  let primaryAmount, secondaryAmount;
  if (amountFromPrimary) {
    primaryAmount = formatNum(amount);
    secondaryAmount = formatNum(amount * rate);
  } else {
    secondaryAmount = formatNum(amount);
    primaryAmount = formatNum(amount / rate);
  }

  useEffect(() => {
    fetch(CURRENCY_URL)
      .then((res) => res.json())
      .then((resJson) => {
        const currency = Object.keys(resJson.conversion_rates)[1];
        setCurrencyOptions([...Object.keys(resJson.conversion_rates)]);
        setPrimaryCurrency(resJson.base_code);
        setSecondaryCurrency(currency);
        setRate(resJson.conversion_rates[currency]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (primaryCurrency != null && secondaryCurrency != null) {
      fetch(EXCHANGE_URL)
        .then((res) => res.json())
        .then((resJson) => setRate(resJson.conversion_rate));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryCurrency, secondaryCurrency]);

  const handlePrimaryAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountFromPrimary(true);
  };

  const handleSecondaryAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountFromPrimary(false);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" gutterBottom>
          Currency Exchange
        </Typography>
        <Typography variant="h6" gutterBottom>
          Convert
        </Typography>
        <AssetRow
          currencyOptions={currencyOptions}
          selectedCurrency={primaryCurrency}
          onChangeCurrency={(e) => setPrimaryCurrency(e.target.value)}
          amount={primaryAmount}
          onChangeAmount={handlePrimaryAmountChange}
        />
        <div>-</div>
        <AssetRow
          currencyOptions={currencyOptions}
          selectedCurrency={secondaryCurrency}
          onChangeCurrency={(e) => setSecondaryCurrency(e.target.value)}
          amount={secondaryAmount}
          onChangeAmount={handleSecondaryAmountChange}
        />
      </Grid2>
    </Grid2>
  );
}
