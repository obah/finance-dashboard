import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";

export default function AssetRow(props) {
  const {
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    amount,
    onChangeAmount,
  } = props;

  return (
    <Box sx={{ marginTop: 1, marginBottom: 1 }}>
      <TextField
        variant="outlined"
        type="number"
        value={amount}
        onChange={onChangeAmount}
      />
      <FormControl variant="filled" sx={{ minWidth: 100 }}>
        <Select value={selectedCurrency} onChange={onChangeCurrency}>
          {currencyOptions?.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
