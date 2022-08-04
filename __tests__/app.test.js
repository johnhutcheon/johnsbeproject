const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

describe("1. GET /api/topics", () => {
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

  test("returns an error when inc_votes spelt incorrectly", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ ink_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
});
