// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

// describe(' Add Reviews Api', () => {

//   it('add review to place should return 200 ', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960baf/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: 3,
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(201);
//         expect(response.body).to.have.property('review');
//       });
//   });

//   it('add review to place should return 409 add anthor review to same place ', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960d62/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: 3,
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(409);
//         expect(response.body).to.have.property('message').to.equal('Only one review is allowed');
//       });
//   });

//   it('add review to place should return 400 invalid object id', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960b6b/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: 3,
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Invalid place');
//       });
//   });

//   it('add review to place should return 400 rate is required', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960b6b/add-review')
//       .set({ authorization: token })
//       .send({
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('rate is required');
//       });
//   });

//   it('add review to place should return 400 rate is integer', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960b6b/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: '1ef4',
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('rate is string');
//       });
//   });
//   it('add review to place should return 400 rate is must be a number between 1~5', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960b6b/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: 7,
//         comment: 'comment test mocha'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Rate must be a number between 1~5');
//       });
//   });
//   it('add review to place should return 400 Comment length cannot exceed 250 characters ', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960b6b/add-review')
//       .set({ authorization: token })
//       .send({
//         rate: 3,
//         comment: 'kjfgjkhfgkjhfsgjkskjfgkjshgfjksjksjjksfjksfdjksjkfjksfjksdfjksdjksjkdfjksdfjksjbvnbsdjksdkjksjksjksdkjfkjsdfkjsdkjdskjfkjdskjsdfjksdfjkdsjsdjkfdsjfjksdfjkdsjkfdsjfkdjsfksdfkjsdfkjdskjfdskjfkjsdfkjskjsdfkjsdfkjsdfkjsdfjkskjsljfkdsfkjsdkjfksdjfkjsdfjksdfjkdsjkf'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Comment length cannot exceed 250 characters');
//       });
//   });


// });