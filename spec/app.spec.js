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
          console.log(res.body)
          expect(res.body.articles[0].article_id).to.equal(1);
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
  });
});
