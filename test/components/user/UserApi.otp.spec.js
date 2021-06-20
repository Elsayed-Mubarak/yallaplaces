// /* eslint-disable no-var */
// /* eslint-disable no-unused-vars */
// const chai = require('chai');
// const { expect } = chai;
// require('mocha');
// // const response = require('express').response();
// const faker = require('faker');
// const request = require('supertest');
// const bcrypt = require('bcryptjs');
// const app = require('../../../app');
// // const UserApi = require('../../../../components/user/user.API');
// // const userModel = require('../../../../components/user/user.model');
// var userData = {};
// var tempToken = '';

// describe('test otp cycle', () => {

//   before(async () => {
//     const hashed_password = await bcrypt.hash('Abcdefg1!', 10);
//     userData = {
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName(),
//       password: hashed_password,
//       phone: `010${ Math.ceil(10000000 + Math.random() * 90000000)}`,
//       email: faker.internet.email(),
//       gender: 'male',
//       birthday: faker.date.past(25, new Date('2007/1/1'))
//       // profileImage: faker.image.avatar(),
//       // isVerified: true
//     };

//   });
//   it('signup ok in otp test', () => {
//     return request('localhost:3000/api')
//       .post('/user/signup')
//       .send(userData)
//       .then((response) => {
//         expect(response.status).to.equal(201);
//         expect(response.body).to.have.property('token');
//         tempToken = response.body['token'];
//       });
//   });

//   it('/user/request-verification-code 200 ok', () => {
//     console.log({ tempToken });
//     console.log(userData);
//     return request('localhost:3000/api')
//       .post('/user/request-verification-code')
//       .send(userData)
//       .set({ authorization: tempToken })
//       .then((response) => {
//         expect(response.status).to.equal(200);
//         console.log(response.body);
//         expect(response.body).to.have.property('timeInSeconds');
//         expect(response.body).to.have.property('phone');
//         expect(response.body).to.have.property('message');

//       });
//   });

//   // if // isVerified: true
//   // it('/user/request-verification-code', () => {
//   //   console.log({ tempToken });
//   //   console.log(userData);
//   //   return request('localhost:3000/api')
//   //     .post('/user/request-verification-code')
//   //     .send(userData)
//   //     .set({ authorization: tempToken })
//   //     .then((response) => {
//   //       expect(response.status).to.equal(400);
//   //       expect(response.body).to.have.property('message').to.equal('User is already verified');

//   //     });
//   // });




// });