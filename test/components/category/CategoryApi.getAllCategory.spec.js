// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

// describe('Category Api', () => {
//   it('Get all Category', () => {
//     return request('localhost:3000/api')
//       .get('/category/home')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//       });
//   });
//   it('Get all Category', () => {
//     return request('localhost:3000/api')
//       .get('/category/home')
//       .set({ authorization: 'fghsjshgjhsfmdgmsgfsdmfgjsgsdmfnsfbdsbf' })
//       .then((response) => {
//         expect(response.status).to.equal(401);
//       });
//   });
// });