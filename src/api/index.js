import axios from 'axios'
import {apiurl} from "@/api/config.js"

const url = apiurl

axios.defaults.timeout = 60000
axios.defaults.baseURL = url
// axios.defaults.headers.post["Content-Type"] = "multipart/form-data"

axios.interceptors.request.use(
  config => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTM5ODY0MDUsImV4cCI6MTYxNDI0NTYwNSwianRpIjoiZDExNGQ5ZmEtMjQzNS00NzQyLWFmYzctYWY1MmVjODA0NTU3IiwiaWQiOjEsInJscyI6IkFkbWluaXN0cmF0b3IiLCJyZl9leHAiOjE2MTQyNDU2MDV9.im9QTEnL4hhQGNT1PT02krjZdJU1GBJeY4SS-7GSsr8'
    if(token){
      config.headers
    }
    console.log(token)
    config.data = JSON.stringify(config.data);
    config.headers = { // 如果沒有cors的問題則可以都不加
      "Access-Control-Allow-Methods": "POST",
      // "Access-Control-Max-Age": "86400",
      "Content-Type": "application/json",
      //"Access-Control-Allow-Origin": "http://localhost:8083"
      "AiMage_Token":'Bearer '+ token
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          console.log("token失效");
          break;
        case 404:
          console.log("找不到該頁面");
          // alert("找不到該頁面")
          break;
        case 500:
          console.log("伺服器出錯");
          // alert("伺服器出錯")
          break;
        case 503:
          console.log("服務失效");
          // alert("服務失效")
          break;
        default:
          console.log(`連接錯誤${err.response.status}`);
          // alert(`連接錯誤${err.response.status}`);
      }
    }
    return Promise.reject(err)
  })

export function post(url, paramObj) {
  return new Promise((resolve) => {
    axios.post(url, paramObj).then(
      response => {
          resolve(response.data);
      },
      err => {
        resolve(err.response.data);
        // resolve(err.response.request.response);
      }
    );
  });
}

export const loginUser = paramObj => post('/login', paramObj)

export const saveNewProject = paramObj => post('/new-project', paramObj)
export const checkProName = paramObj => post('/check-project-name', paramObj)
