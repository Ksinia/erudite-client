let url = "https://k-erudite.herokuapp.com";
if (process.env.NODE_ENV === "development") {
  url = process.env.REACT_APP_API_URL || "http://localhost:4000";
}
export { url };
