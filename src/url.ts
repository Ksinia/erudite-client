let url = "https://k-erudite.herokuapp.com";
if (process.env.NODE_ENV === "development") {
  url = process.env.REACT_APP_API_URL || "http://localhost:4000";
}

let frontEndUrl = "https://erudit.ksinia.net";
if (process.env.NODE_ENV === "development") {
  frontEndUrl = process.env.REACT_APP_FE_URL || "http://localhost:3000";
}
export { url, frontEndUrl };
