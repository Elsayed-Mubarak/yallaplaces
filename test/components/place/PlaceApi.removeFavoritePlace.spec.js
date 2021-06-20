// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';


// describe('Remove place Form favorite', () => {

//   //   it('remove place should return 200', () => {
//   //     return request('localhost:3000/api')
//   //       .put('/place/5e5d154ed00d0024bc960baf/remove-place-from-favorites')
//   //       .set({ authorization: token })
//   //       .then((response) => {
//   //         expect(response.status).to.equal(200);
//   //         expect(response.body).to.have.property('favoritePlaces').to.be.a('array');
//   //       });
//   //   });

//   it('remove place should return 400 invalid place', () => {
//     return request('localhost:3000/api')
//       .put('/place/5e5d154ed00d0024bc96110200/remove-place-from-favorites')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Invalid place');
//       });
//   });

//   it('remove place should return 400 place not added in favorite place', () => {
//     return request('localhost:3000/api')
//       .put('/place/5e5d154ed00d0024bc960baf/remove-place-from-favorites')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         console.log(response.body);
//         expect(response.body).to.have.property('message').to.equal('place not added');
//       });
//   });

// });