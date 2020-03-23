let url = "https://k-erudite.herokuapp.com";
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:4000";
}
export { url };
