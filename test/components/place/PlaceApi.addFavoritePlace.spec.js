// // /category/home'
// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// const request = require('supertest');
// const app = require('../../../app');
// var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY4NjEyMTQ0MiwiZXhwIjoxNTg2MjQ0MTI1MDAwMDAwLCJpYXQiOjE1ODYxNTc3MjUwMDAwMDAsIl9pZCI6IjVlNWQxNTRlZDAwZDAwMjRiYzk2MGI2YSIsInJvbGUiOiJ1c2VyIn0.Oedge2Zf203Izrq-nvcaPmAgazmlTKPNB2QsjEJhDI8';

// describe('Add Place To favourite', () => {

//   it('add place to favorite should retuen 200 should replace place id to work good', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960c23/add-to-favorites')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//         expect(response.body).to.have.property('favoritePlaces').to.be.a('array');
//         // response.should.have.status(200);
//         // response.body.should.to.have('favoritePlaces').to.be.a('array');
//       });
//   });
//   it('add place to favorite should retuen 400 invalid place id', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960c066/add-to-favorites')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//       });
//   });
//   it('add place to favorite should retuen 400', () => {
//     return request('localhost:3000/api')
//       .post('/place/5e5d154ed00d0024bc960baf/add-to-favorites')
//       .set({ authorization: token })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('place already added');
//       });
//   });
// });