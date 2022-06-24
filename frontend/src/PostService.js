import axios from "axios";
import { reject, resolve } from "core-js/fn/promise";

let url = "http://localhost:3000/posts";

class PostService {
  //Get
  static getPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios.get(url);
        let data = res.data;
        resolve(
          data.map((post) => ({
            ...data,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  //Create
  static insertPost(text) {
    return axios.post(url, {
      naslov: naslov,
      opis: opis,
      materijali: materijali,
      alati: alati,
    });
  }
  //Delete
  static deletePost(id) {
    return axios.delete(`${url}${id}`);
  }
}

export default PostService;
