'use strict';

const request = require('supertest');

const app = require('../app');


describe('app', () => {
  describe('GET /', () => {
    it('should return html', done => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  describe('GET /calculus', () => {
    it('should support UTF-8', done => {
      const query = encodeURIComponent('1 + 2');

      request(app)
        .get(`/calculus?query=${query}`)
        .expect(200, { result: 3 })
        .end(done);
    });

    it('should support BASE64', done => {
      const query = (new Buffer('1 + 2')).toString('base64');

      request(app)
        .get(`/calculus?query=${query}`)
        .expect(200, {
          result: 3,
        })
        .end(done);
    });

    it('should return error if no query provided', done => {
      request(app)
        .get('/calculus')
        .expect(400, {
          error: 'No query provided',
        })
        .end(done);
    });
  });
});
