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
      it('GET 200, Returns all an object filtered by topic', () => request
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(1);
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
    describe('/:article_id', () => {
      it('GET 200, Returns an article by its ID when passed an id into the parameters', () => request
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
          expect(res.body.article[0].article_id).to.equal(1);
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
      it('PATCH, returns status:202, and increments vote of article by 1 when passed a newVote with the value of 1', () => request
        .patch('/api/articles/1')
        .send({
          inc_votes: 1,
        })
        .expect(202)
        .then((res) => {
          expect(res.body.updatedArticle[0]).to.be.an('object');
          expect(res.body.updatedArticle[0].votes).to.eql(101);
        }));
      it('GET 204, Deletes an article when passed its id as a query', () => request
        .delete('/api/articles/1')
        .expect(204)
        .then((res) => {
          expect(res.status).to.eql(204);
          expect(res.body).to.eql({});
        }));
    });
    describe('/:article_id/comments', () => {
      it('GET returns status: 200 and returns all the comments by article_id', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
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
    });
  });
});
