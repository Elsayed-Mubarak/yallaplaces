// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// // const response = require('express').response();
// // const faker = require('faker');
// const request = require('supertest');
// const app = require('../../../app');
// // const UserApi = require('../../../../components/user/user.API');
// // const userModel = require('../../../../components/user/user.model');

// const userData = {
//   email: 'abdallah@shaban.com',
//   password: 'Abcdefg1!'
// };

// describe('testing  user login ', () => {

//   it('login ok', () => {
//     return request('localhost:3000/api')
//       .post('/user/login')
//       .send(userData)
//       .then((response) => {
//         console.log(response.body);
//         expect(response.status).to.equal(200);
//         expect(response.body).to.have.property('token');
//         expect(response.body).to.have.property('userData');

//       });
//   });

//   it('login required email and password ', () => {
//     return request('localhost:3000/api')
//       .post('/user/login')
//       .send({
//         email: 'a@a.com'
//         // password: '123'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('email is required');
//         expect(response.body).to.have.property('message').to.equal('password is required');
//       });
//   });

//   it('login validation schema  email ', () => {
//     return request('localhost:3000/api')
//       .post('/user/login')
//       .send({
//         email: 'wwwww',
//         password: '123'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('email does not match any of the allowed types');
//         // expect(response.body).to.have.property('userData');
//       });
//   });

//   it('login validation schema  phone ', () => {
//     return request('localhost:3000/api')
//       .post('/user/login')
//       .send({
//         email: '02226246811',
//         password: 'Abcdefg1'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('email is required');
//         expect(response.body).to.have.property('message').to.equal('Phone must consist of 11 numbers and starts with 01');
//       });
//   });

//   it('login Invalid username or password', () => {
//     return request('localhost:3000/api')
//       .post('/user/login')
//       .send({
//         email: 'abdallah1@shaban.com',
//         password: 'Abcdefg1'
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Invalid username or password');

//       });
//   });

// });