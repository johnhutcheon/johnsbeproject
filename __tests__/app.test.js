const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require("jest-sorted");

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

  test("returns empty array when no comments attached to ID", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(0);
      });
  });
});

//////////////////////

/// TICKET 10

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201, responds with an object with required properties and the posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "butter_bridge",
        body: "hi",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("body");
      });
  });
});

/// TICKET 11

describe("11. GET /api/articles (queries)", () => {
  test("sorts the response by default created_at when no sort_by defined in request ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("sorts the response by votes ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("sorts the response by a articles feild and requested order ", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });
  test("sorts the response by a articles feild, requested order and filters by requeted topic ", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=ASC&topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("title", { descending: false });
        articles.forEach((article) => {
          expect(article.topic).toEqual("cats");
        });
      });
  });
  test("returns all topics if no topics requested ", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("title", { descending: false });
        expect(articles).toHaveLength(12);
      });
  });
  test("returns error if order_by is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order_by=Aggg&topic=spaceman")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("returns error if sort_by is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=badger&order_by=ASC&topic=spaceman")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

//// TICKET 12

describe("12. DELETE /api/comments/:comment_id", () => {
  test("delete the given comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

test("Status 404: when passed a valid but non-existent id", () => {
  return request(app)
    .delete("/api/comments/163")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment_id not found");
    });
});
test("Status 400: when passed an invalid id", () => {
  return request(app)
    .delete("/api/comments/notavalidid")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid Request");
    });
});
