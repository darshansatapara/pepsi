import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.54.43:5000",
  // timeout: 10000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
