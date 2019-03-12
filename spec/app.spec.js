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
    });
    describe('/articles', () => {
      const articlePost = {
        title: 'This is the title',
        topic: 'mitch',
        body: 'This is the body',
        author: 'icellusedkars',
        votes: 0,
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
});
