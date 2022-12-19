import axios from "axios";
let baseURL = "http://127.0.0.1:5000/api";
if (process.env.NODE_ENV === "production") {
  baseURL = "api";
}
export const API = axios.create({
  baseURL,
});
