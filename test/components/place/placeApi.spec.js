// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

// describe('>>>>>>>> Place Api >>>>>>>>>', () => {

//   it('get places by category should return 200', () => {
//     return request('localhost:3000/api')
//       .get('/places/5e5d154ed00d0024bc960b6b')
//       .query({ pageNo: 0, limitNo: 5 })
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//         expect(response.body).to.have.property('places');
//         expect(response.body).to.have.property('placesCount');
//       });
//   });

//   it('get places by category should return 400 invalid object id', () => {
//     return request('localhost:3000/api')
//       .get('/places/5e5d154ed00d0024bc960b6b0')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Invalid Category name');
//       });
//   });

//   it('Get Place info return 200', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960b92/info')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//       });
//   });
//   it('Get Place info should return 400 id not correct', () => {
//     return request('localhost:3000/api')
//       .get('/place/5e5d154ed00d0024bc960b920/info')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//       });
//   });
// });