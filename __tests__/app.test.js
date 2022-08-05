const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

describe("3. GET /api/topics", () => {
  test("status:200, responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });

  describe("handles all bad requests", () => {
    test("responds with 404", () => {
      return request(app)
        .get("/api/banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Page not found");
        });
    });
  });
});

describe("4. GET /api/articles/:article_id", () => {
  test("status:200, responds with an article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveProperty("article_id");
        expect(articles).toHaveProperty("title");
        expect(articles).toHaveProperty("topic");
        expect(articles).toHaveProperty("author");
        expect(articles).toHaveProperty("body");
        expect(articles).toHaveProperty("created_at");
        expect(articles).toHaveProperty("votes");
      });
  });
});

describe("handles an invalid path", () => {
  test("responds with 400", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
});

describe("5. PATCH /api/articles/article_id:", () => {
  test("responds with 400 when an ID is not a number", () => {
    return request(app)
      .patch("/api/articles/dog")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  test("responds with the vote property updated when adding 1", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(1);
      });
  });

  test("responds with the vote property updated when subtracting 1", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(-1);
      });
  });

  test("checks an article ID that doesn't exist and returns 404 error", () => {
    return request(app)
      .patch("/api/articles/20")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });

  test("returns an error when non-number passed through inc_votes", () => {
    return request(app)
      .patch("/api/articles/20")
      .send({ inc_votes: "dog" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  test("returns an error when inc_votes is spelt incorrectly", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ ink_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
});

describe("6. GET /api/users", () => {
  test("status:200, responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users[0]).toHaveProperty("username");
        expect(users[1]).toHaveProperty("name");
        expect(users[2]).toHaveProperty("avatar_url");
      });
  });
});

describe("7. GET /api/articles/:article_id (comment count)", () => {
  test("status:200, responds with comment count added to articles", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveProperty("title");
        expect(articles).toHaveProperty("topic");
        expect(articles).toHaveProperty("author");
        expect(articles).toHaveProperty("body");
        expect(articles).toHaveProperty("created_at");
        expect(articles).toHaveProperty("votes");
        expect(articles).toHaveProperty("comment_count");
      });
  });
});

describe("8. GET /api/articles", () => {
  test("status:200, responds with an array of topics", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toEqual(12);
      });
  });

  test("responds with required properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveProperty("title");
        expect(articles).toHaveProperty("topic");
        expect(articles).toHaveProperty("author");
        expect(articles).toHaveProperty("body");
        expect(articles).toHaveProperty("created_at");
        expect(articles).toHaveProperty("votes");
        expect(articles).toHaveProperty("comment_count");
      });
  });
});

describe("9. GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with comments for correct article ID", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 3,
            })
          );
        });
      });
  });

  test("returns a 400 error when passed invalid ID", () => {
    return request(app)
      .get("/api/articles/cat/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  test("returns a 404 error when passed valid ID that doesn't exist", () => {
    return request(app)
      .get("/api/articles/404/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });
});
