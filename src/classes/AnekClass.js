export default class Anek {
  constructor(title, body, author, time, id, rating = 0, reverseTime, ratedUsers = { key: 'value' }) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.time = time;
    this.id = id;
    this.rating = rating;
    this.reverseTime = reverseTime;
    this.ratedUsers = ratedUsers;
  }
}
