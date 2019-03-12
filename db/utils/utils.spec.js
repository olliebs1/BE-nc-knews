process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../connection');
const { articleDateTimeStamp, createRef } = require('../utils/utils');

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
describe('', () => {
  const articleTest = {
    title: 'Test Title',
    body: 'Test body',
    votes: 'Test votes' || 0,
    topic: 'Test Topic',
    author: 'Test Author',
    created_at: 1233443233,
  }
  it('Returns a Key:Value pair of title and article_id when passed into the createRef function', () => {
    const actual = createRef(articleTest, 'title', 'article_id')
    const expected = { 'Test Title': 1 }
    expected(actual).to.eql(expected)
  });
});