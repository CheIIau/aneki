class Anek {
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

class User {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
  }
}

class Meme {
  constructor(
    imageUrl = '',
    author,
    userId,
    time = Date.now(),
    reverseTime = 0 - Date.now(),
    rating = 0,
    ratedUsers = { key: 'value' },
  ) {
    this.imageUrl = imageUrl;
    this.author = author;
    this.userId = userId;
    this.time = time;
    this.reverseTime = reverseTime;
    this.rating = rating;
    this.ratedUsers = ratedUsers;
  }
}
export { Anek, User, Meme };
