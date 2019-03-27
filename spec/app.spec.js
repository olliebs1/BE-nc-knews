process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../db/connection.js');
const app = require('../app.js');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/api', () => {
    describe('/topics', () => {
      it('Returns a status 200 and all topics', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics).to.have.lengthOf(2);
          expect(res.body.topics[0]).to.contain.keys('slug', 'description');
        }));
    });
    describe('/topics', () => {
      const topicPost = {
        slug: 'new slug',
        description: 'creating a new description',
      };
      it('POSTS status 201, returns the new topic as it appears in the database', () => request.post('/api/topics')
        .send(topicPost)
        .expect(201)
        .then((res) => {
          expect(res.body.topic).to.be.an('object');
          expect(res.body.topic).to.contain.keys('slug', 'description');
        }));
      it('Returns an error code 422 when the insterted topic is already in the database', () => request
        .post('/api/topics')
        .send({
          description: 'Not dogs',
          slug: 'cats',
        })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Unprocessible Entity');
        }));
      it('GET request, Returns an error 405 when passed an invalid method', () => request
        .put('/api/topics')
        .expect(405));
      it('Returns a error status 405', () => request
        .patch('/api/topics')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Method Not Allowed');
        }));
      it('Returns an error code 400 when the insterted topic is missing fields', () => request
        .post('/api/topics')
        .send({ slug: 'New Slug' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
    });
    describe('/api/jingleBells', () => {
      it('Returns an error 404 when passed a bad route from the api', () => request
        .get('/api/jingleBells')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Route Not Found');
        }));
    });
    describe('/bad-route', () => {
      it('Returns an error 404 when passed a bad route', () => request
        .get('/bad-route')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Route Not Found');
        }));
    });
  });
  describe('/articles', () => {
    it('Returns a status 200 and all articles', () => request
      .get('/api/articles')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles[0]).to.contain.keys('article_id', 'title', 'votes', 'topic', 'author', 'created_at', 'comment_count');
      }));

    it('Returns a status: 200, and an object containing a comment_count as a key', () => request
      .get('/api/articles')
      .expect(200)
      .then());
    it('GET 200, Returns all an object filtered by authors', () => request
      .get('/api/articles?author=icellusedkars')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.have.lengthOf(6);
      }));
    it('Error Bad Query, Returns an error 400 when passed an argument to sort by that doesnt exist', () => request
      .get('/api/articles?sort_by=goliath')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('Error Bad Query, Returns an error 400 when order isnt asc or desc', () => request
      .get('/api/articles?order=hello')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('GET 200, Returns all an object filtered by topic', () => request
      .get('/api/articles?topic=cats')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.have.lengthOf(1);
      }));
    it('Returns a error status 404 for a get request for a topic that doesnt exist', () => request
      .get('/api/topic=bollywood')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
    it('GET 200, Returns all an object sorted by date by default', () => request
      .get('/api/articles')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].article_id).to.equal(1);
      }));
    it('GET 200, Returns an array of objects by a valid column by default in desc order', () => request
      .get('/api/articles?sort_by=article_id')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].article_id).to.equal(12);
      }));
    it('GET 200, Returns all an object sorted by date by having column asc through a query', () => request
      .get('/api/articles?sort_by=article_id&&order=asc')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].article_id).to.equal(1);
      }));
    it('GET 200, Returns all an object sorted by comment_count by having column asc through a query', () => request
      .get('/api/articles?sort_by=comment_count&&order=asc')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].article_id).to.equal(11);
      }));
  });
  describe('/articles', () => {
    const articlePost = {
      title: 'This is the title',
      topic: 'mitch',
      body: 'This is the body',
      author: 'icellusedkars',
    };
    it('POSTS status 201, returns the new article as it appears in the database', () => request.post('/api/articles')
      .send(articlePost)
      .expect(201)
      .then((res) => {
        expect(res.body.articles).to.be.an('object');
        expect(res.body.articles).to.contain.keys('article_id', 'title', 'body', 'created_at', 'topic', 'author', 'votes');
      }));
    it('GET request, Returns an error 405 when passed an invalid method', () => request
      .put('/api/articles')
      .expect(405));
    it('Returns a error status 400 for a post request for a an article that has missing keys', () => request
      .post('/api/articles')
      .send({

        topic: 'mitch',
        body: 'This is the body',
        author: 'icellusedkars',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('Returns a error status 400 for a post request to a username that doesnt exist', () => request
      .post('/api/articles')
      .send({
        title: 'This is the title',
        topic: 'mitch',
        body: 'This is the body',
        author: 'diego',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('Returns a error status 400 for a post request to a topic that doesnt exist', () => request
      .post('/api/articles')
      .send({
        title: 'This is the title',
        topic: 'Terry',
        body: 'This is the body',
        author: 'icellusedkars',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    describe('/articles/:article_id', () => {
      it('GET 200, Returns an article by its ID when passed an id into the parameters', () => request
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
          expect(res.body.article.article_id).to.equal(1);
        }));
      it('GET request, Returns an error 400 by when passed an invalid integer', () => request
        .get('/api/articles/99999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Route Not Found');
        }));
      it('GET returns an error of 404 when passed an article_id that doesnt exist in the database', () => request
        .get('/api/articles/dog')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('GET 200, Returns an article by its ID when passed an id into the parameters', () => request
        .get('/api/articles/5')
        .expect(200)
        .then((res) => {
          expect(res.body.article[0].article_id).to.equal(5);
        }));
      it('GET 200, Returns an article by its ID when passed an if into the parameters returning comment_count as a key', () => request
        .get('/api/articles/6')
        .expect(200)
        .then((res) => {
          expect(res.body.article[0]).to.contain.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count');
        }));
      it('PATCH, returns status:200, and increments vote of article by 1 when passed a newVote with the value of 1', () => request
        .patch('/api/articles/1')
        .send({
          inc_votes: 1,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.updatedArticle[0]).to.be.an('object');
          expect(res.body.updatedArticle[0].votes).to.eql(101);
        }));
      it('PATCH, returns a 200 when no inc_votes is passed into the req.body', () => request
        .patch('/api/articles/1')
        .send({})
        .expect(200)
        .then((res) => {
          expect(res.body.updatedArticle[0]).to.be.an('object');
        }));
      it('PATCH, returns an error 422 when inc_votes isnt passed an integer as its key value pair', () => request
        .patch('/api/articles/1')
        .send({ inc_votes: 'cat' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('DELETE status 204, Deletes an article when passed its id as a query', () => request
        .delete('/api/articles/1')
        .expect(204));
      it('DELETE method returns error 404 when deleting an article and passed an id that doesnt exist', () => request
        .delete('/api/articles/123')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Route Not Found');
        }));
      it('DELETE method returns error 400 when deleting an article and passed an id that isnt an integer', () => request
        .delete('/api/articles/cat')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('Returns an error 405 when passed an invalid method', () => request
        .post('/api/articles/1')
        .expect(405));
    });
    describe('/:article_id/comments', () => {
      it('GET returns status: 200 and returns all the comments by article_id', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
        }));
      it('GET request, Returns an error 400 when passed an invalid integer', () => request
        .get('/api/articles/dog/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('GET request, Returns an error 400 when passed an invalid integer', () => request
        .get('/api/articles/barry-manilow/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('GET request, Returns an error 400 when passed an invalid integer', () => request
        .get('/api/articles/1234/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Route Not Found');
        }));
      it('GET returns status: 200 and returns all the comments by article_id', () => request
        .get('/api/articles/6/comments')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
        }));
      it('GET returns status: 200 and returns all the comments by article_id which has been sorted a specified column and defaults to desc order', () => request
        .get('/api/articles/1/comments?sort_by=comment_id')
        .expect(200)
        .then((res) => {
          expect(res.body.comments[0].comment_id).to.eql(18);
          expect(res.body).to.be.an('object');
        }));
      it('POST returns status 201, and returns the new comment as it appears in the database', () => request
        .post('/api/articles/1/comments')
        .send({ author: 'butter_bridge', body: 'What a brilliant comment', votes: 0 })
        .expect(201)
        .then((res) => {
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment).to.contain.keys('comment_id', 'body', 'votes', 'author', 'article_id', 'created_at');
        }));
      it('Returns a error status 400 for a post method for a comment that has missing keys', () => request
        .post('/api/articles/1/comments')
        .send({ author: 'butter_bridge', body: 'What a brilliant comment' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('Returns a error status 400 for a post method for a comment when the article_id that isnt an integer', () => request
        .post('/api/articles/dog/comments')
        .send({ author: 'butter_bridge', body: 'What a brilliant comment' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Error: Bad Request');
        }));
      it('Returns a error status 400 for a post method for a comment when the article_id that doesnt exist', () => request
        .post('/api/articles/1234/comments')
        .send({ author: 'butter_bridge', body: 'What a brilliant comment', votes: 0 })
        .expect(4004
          .then(({ body }) => {
            expect(body.msg).to.equal('Error: Route Not Found');
          })));
      it('GET request, Returns an error 405 when passed an invalid method', () => request
        .put('/api/articles/1234/comments')
        .expect(405));
    });
  });
  describe('/comments/:comment_id', () => {
    it('PATCH, returns status: 202, and increments vote of comment by 1 when passed a newVote with the value of 1', () => request
      .patch('/api/comments/3')
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.updatedComment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'body', 'created_at');
        expect(res.body.updatedComment).to.be.an('object');
        expect(res.body.updatedComment.votes).to.eql(101);
      }));
    it('PATCH, returns an error 400 when no inc_votes is passed into the req.body', () => request
      .patch('/api/comments/1')
      .send({ teaPot: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('PATCH, returns an error 400 when no inc_votes is passed into the req.body', () => request
      .patch('/api/comments/dingo')
      .send({ votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('PATCH, returns an error 400 when inc_votes isnt passed an integer as its key value pair', () => request
      .patch('/api/comments/1')
      .send({ inc_votes: 'cat' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('DELETE, returns status 204, and deletes the comments when passed its comment ID', () => request
      .delete('/api/comments/1')
      .expect(204)
      .then((res) => {
        expect(res.status).to.eql(204);
        expect(res.body).to.eql({});
      }));
    it('DELETE, returns status 404, and deletes the comments when passed its comment ID', () => request
      .delete('/api/comments/1999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
    it('DELETE method returns error 400 when deleting a comment and passed an id that isnt an integer', () => request
      .delete('/api/comments/cat')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('DELETE method returns error 404 when deleting an article and passed an id that doesnt exist', () => request
      .delete('/api/articles/123')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
    it('Returns an error 405 when passed an invalid method', () => request
      .post('/api/comments/1')
      .send({ inc_votes: 'cat' })
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Method Not Allowed');
      }));
  });
  describe('/users', () => {
    const userPost = {
      username: 'ollie1234',
      avatar_url: 'www.google.co.uk',
      name: 'ollie',
    };
    it('GET request, Returns an error 405 when passed an invalid method', () => request
      .put('/api/users')
      .expect(405));
    // patch/delete test error for a 405 ^ like above
    it('GET, returns status 200: and returns all users containing keys - username, avatar_url, name', () => request
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body.users).to.be.an('array');
        expect(res.body.users[0]).to.contain.keys('username', 'avatar_url', 'name');
      }));
    it('Error Bad Query, Returns an error 404 when given a bad path', () => request
      .get('/api/user')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
    it('POSTS status 201, returns the new topic as it appears in the database', () => request.post('/api/users')
      .send(userPost)
      .expect(201)
      .then((res) => {
        expect(res.body.user).to.be.an('object');
        expect(res.body.user).to.contain.keys('username', 'avatar_url', 'name');
      }));
    it('Returns an error code 422 when the insterted user is already in the database', () => request
      .post('/api/users')
      .send({
        username: 'icellusedkars',
        name: 'sam',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Unprocessible Entity');
      }));
    it('Returns an error code 400 when the insterted topic is missing fields', () => request
      .post('/api/users')
      .send({
        username: 'icellusedkars',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Bad Request');
      }));
    it('GET 200, Returns a user by its username when passed a username into the parameters', () => request
      .get('/api/users/icellusedkars')
      .expect(200)
      .then((res) => {
        expect(res.body.user).to.be.an('object');
        expect(res.body.user).to.contain.keys('username', 'avatar_url', 'name');
      }));
    it('GET request, Returns an error 400 by when passed an invalid integer', () => request
      .get('/api/users/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
    it('Returns a error status 404 for a get request for a author that doesnt exist', () => request
      .get('/api/username=treacle')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Error: Route Not Found');
      }));
  });
  describe('/api', () => {
    it('GET, returns status 200: and returns all endpoints', () => request
      .get('/api')
      .expect(200)
      .then((res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
      }));
  });
});
