export const fxRequest = async (asset1, asset2, amount) => {
  const API = process.env.REACT_APP_FX_API;
  const URL = `https://v6.exchangerate-api.com/v6/${API}/pair/${asset1}/${asset2}/${amount}`;
  const response = await fetch(URL);
  const responseJson = response.json();
  console.log(responseJson);
  return responseJson;
};
