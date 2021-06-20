// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

// describe('Get reviews Api', () => {

//   it('get all review should return 200', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960baf/get-reviews')
//       .query({ pageNo: 0, limitNo: 4 })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//         expect(response.body).to.have.property('userReview');
//         expect(response.body).to.have.property('otherReviews');
//         expect(response.body).to.have.property('otherReviewsCount').to.be.a('number');
//       });
//   });

//   it('get all review should return 400', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960baff0/get-reviews')
//       .query({ pageNo: 0, limitNo: 4 })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Invalid place');
//       });
//   });

//   it('get all review should return 400 pageNo required', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960baf/get-reviews')
//       .query({ limit: 5 })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('pageNo is required');
//       });
//   });

//   it('get all review should return 400 limitNo required', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960baf/get-reviews')
//       .query({ pageNo: 10 })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('limitNo is required');
//       });
//   });
//   it('get all review should return 400 invalid limit no', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960baf/get-reviews')
//       .query({ pageNo: 0, limitNo: '3+4' })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Enter a valid number');
//       });
//   });



// });