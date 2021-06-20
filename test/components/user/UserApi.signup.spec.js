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
//   firstName: 'unitTest',
//   lastName: 'unitTest',
//   password: 'Abcdefg1!',
//   phone: '01128246811',
//   email: 'unitTest@shaban.com',
//   gender: 'male',
//   birthday: 2019 - 02 - 22
// };


// describe('testing  user signup', () => {
// //   it('signup ok', () => {
// //     return request('localhost:3000/api')
// //       .post('/user/signup')
// //       .send(userData)
// //       .then((response) => {
// //         expect(response.status).to.equal(201);
// //         expect(response.body).to.have.property('token');

//   //       });
//   //   });

//   it('signup validation schema required', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'Abcdefg1!',
//         phone: '01128246811',
//         email: 'unitTest@shaban.com',
//         gender: 'male'
//         // birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('firstName is required');
//         // expect(response.body).to.have.property('message').to.equal('lastName is required');
//         // expect(response.body).to.have.property('message').to.equal('password is required');
//         // expect(response.body).to.have.property('message').to.equal('phone is required');
//         // expect(response.body).to.have.property('message').to.equal('email is required');
//         // expect(response.body).to.have.property('message').to.equal('gender is required');
//         expect(response.body).to.have.property('message').to.equal('birthday is required');

//       });
//   });

//   it('signup validation schema firstName , lastName lenght ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'u',
//         password: 'Abcdefg1!',
//         phone: '01128246811',
//         email: 'unitTest@shaban.com',
//         gender: 'male',
//         birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('First name length must be between 2~20 characters and consists of letters only');
//         expect(response.body).to.have.property('message').to.equal('Last name length must be between 2~20 characters and consists of letters only');
//       });
//   });

//   it('signup validation schema password ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'abdalah',
//         phone: '01128246811',
//         email: 'unitTest@shaban.com',
//         gender: 'male',
//         birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character');
//       });
//   });

//   it('signup validation schema phone ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'Abcdefg1!',
//         phone: '0112624681',
//         // phone: 0112624681,
//         email: 'unitTest@shaban.com',
//         gender: 'male',
//         birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Phone must consist of 11 numbers and starts with 01');
//         // expect(response.body).to.have.property('message').to.equal('phone must be a string');
//       });
//   });

//   it('signup validation schema email ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'Abcdefg1!',
//         phone: '01126246811',
//         email: 'unitTest@',
//         gender: 'male',
//         birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('email must be a valid email');
//       });
//   });

//   it('signup validation schema gender ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'Abcdefg1!',
//         phone: '01126246811',
//         email: 'a@a.com',
//         gender: 'femalel',
//         birthday: 2019 - 02 - 22
//       })
//       .then((response) => {
//         expect(response.status).to.equal(400);
//         expect(response.body).to.have.property('message').to.equal('Gender must be either male or female');
//       });
//   });

//   it('signup validation schema birthday ', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send({
//         firstName: 'unitTest',
//         lastName: 'unitTest',
//         password: 'Abcdefg1!',
//         phone: '01126246811',
//         email: 'a@a.com',
//         gender: 'male',
//         birthday: 2015 - 02 - 22
//       })
//       .then((response) => {
//         console.log(response.body);

//         expect(response.status).to.equal(400);
//         // expect(response.body).to.have.property('message').to.equal('You must be at least 12 years old to signup');
//       });
//   });




// });