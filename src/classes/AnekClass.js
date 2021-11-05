export default class Anek {
  constructor(title, body, author, time, id = null, rating = 0, ratedUsers = {}) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.time = time;
    this.id = id;
    this.rating = rating;
    this.ratedUsers = ratedUsers;
  }
}
