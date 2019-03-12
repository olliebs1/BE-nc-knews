process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../connection');
const { articleDateTimeStamp, createRef, createArticleIdLink } = require('../utils/utils');

describe('articleDateTimeStamp', () => {
  after(() => connection.destroy());
  const input = [{
    title: 'Hello',
    body: 'This is the body',
    votes: 13 || 0,
    topic: 'This is the topic',
    author: 'this is the author',
    created_at: 12393849940,
  }];
  it('Returns an Array of items when userData is inserted into a table', () => {
    const actual = articleDateTimeStamp(input);
    const expected = [{
      title: 'Hello',
      body: 'This is the body',
      votes: 13 || 0,
      topic: 'This is the topic',
      author: 'this is the author',
      created_at: new Date(12393849940),

    }];
    expect(actual).to.eql(expected);
  });
  it('Returns an array when passed an array', () => {
    const actual = articleDateTimeStamp(input);
    expect(actual).to.be.an('array');
  });
  it('The array returned contains the same keys as the input array', () => {
    const actual = articleDateTimeStamp(input);
    expect(actual[0]).to.contain.keys('title', 'body', 'votes', 'topic', 'author', 'created_at');
  });
});
describe('createRef', () => {
  const articleTest = [{
    article_id: 1,
    title: 'Test Title',
    body: 'Test body',
    votes: 'Test votes' || 0,
    topic: 'Test Topic',
    author: 'Test Author',
    created_at: 1233443233,
  }];
  it('Returns a Key:Value pair of title and article_id when passed into the createRef function', () => {
    const actual = createRef(articleTest, 'title', 'article_id');
    const expected = { 'Test Title': 1 };
    expect(actual).to.eql(expected);
  });
  it('Returns multiple Key:Value pairs of title and article_id when passed an array of more than one article', () => {
    const articleTest2 = [{
      article_id: 1,
      title: 'Test Title',
      body: 'Test body',
      votes: 'Test votes' || 0,
      topic: 'Test Topic',
      author: 'Test Author',
      created_at: 1233443233,
    }, {
      article_id: 2,
      title: 'Test Title 2',
      body: 'Test body 2',
      votes: 'Test votes 2' || 0,
      topic: 'Test Topic 2',
      author: 'Test Author 2',
      created_at: 1233443343,
    }];
    const actual = createRef(articleTest2, 'title', 'article_id');
    const expected = { 'Test Title': 1, 'Test Title 2': 2 };
    expect(actual).to.eql(expected);
  });
});
describe('createArticleIdLink', () => {
  const comment = [{

  }];
  it('Returns an object containing ', () => {
    const refCreation = { 'Title Test': 1 };
    const testComment = [{
      body: 'Test Body',
      belongs_to: 'Biggest Football Blunders',
      created_by: 'John Terry',
      votes: 0,
      created_at: 17262712827,
    }];
    const actual = createArticleIdLink(testComment, refCreation);
    const expected = [{
      author: 'John Terry',
      article_id: refCreation[1],
      votes: 0,
      created_at: new Date(17262712827),
      body: 'Test Body',
    }];
    expect(actual).to.eql(expected);
  });
});
