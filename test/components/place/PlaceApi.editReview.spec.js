// /category/home'
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const chai = require('chai');
const { expect } = chai;
require('mocha');
const request = require('supertest');
const app = require('../../../app');
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

describe('Edit Review Api', () => {

  it('edit review should return 200', async () => {
    return await request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        rate: 3,
        comment: 'comment update with mocha test'
      })
      .then((response) => {
        expect(response.status).to.equal(204);
      });
  });

  it('edit review should return 409 ', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        rate: 3,
        comment: 'comment update with mocha test'
      })
      .then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body).to.have.property('message').to.equal('Updated review is identical to old review');
      });
  });

  it('edit review should return 400 invalid review id', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a700/edit-review')
      .set({ authorization: token })
      .send({
        rate: 4,
        comment: 'comment update with mocha test'
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('Invalid place');
      });
  });

  it('edit review  should return 400 rate is required', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        comment: 'comment test mocha'
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('rate is required');
      });
  });

  it('add review to place should return 400 rate is integer', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        rate: '1er3',
        comment: 'comment test mocha'
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('rate must be a number');
      });
  });

  it('add review to place should return 400 rate is must be a number between 1~5', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        rate: 7,
        comment: 'comment test mocha'
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('Rate must be a number between 1~5');
      });
  });

  it('add review to place should return 400 Comment length cannot exceed 250 characters ', () => {
    return request('localhost:3000/api')
      .put('/place/5e8ae0bd2474612efca454a7/edit-review')
      .set({ authorization: token })
      .send({
        rate: 3,
        comment: 'kjfgjkhfgkjhfsgjkskjfgkjshgfjksjksjjksfjksfdjksjkfjksfjksdfjksdjksjkdfjksdfjksjbvnbsdjksdkjksjksjksdkjfkjsdfkjsdkjdskjfkjdskjsdfjksdfjkdsjsdjkfdsjfjksdfjkdsjkfdsjfkdjsfksdfkjsdfkjdskjfdskjfkjsdfkjskjsdfkjsdfkjsdfkjsdfjkskjsljfkdsfkjsdkjfksdjfkjsdfjksdfjkdsjkf'
      })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('Comment length cannot exceed 250 characters');
      });
  });
});