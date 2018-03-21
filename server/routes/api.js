const express = require('express');
const router = express.Router();
const request = require('request');
const nodemailer = require('nodemailer');
// // const xoauth2 = require('xoauth2');

/* GET api listing. */
router.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("X-Frame-Options", "SAMEORIGIN, GOFORIT");
    // Set the headers
  SERVER_KEY = "VT-server-BQj90augzK8GqELJEy46onVC"
  AUTH_STRING = "Basic VlQtc2VydmVyLUJRajkwYXVneks4R3FFTEpFeTQ2b25WQzo=";
  // AUTH_STRING = "VlQtc2VydmVyLUNwbzAza1lET2MwY05VS2d0NmhuTGtLZzo="
  // AUTH_STRING = "Basic VlQtc2VydmVyLUJRajkwYXVneks4R3FFTEpFeTQ2b25WQzo=";
  const headers = {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Basic " + AUTH_STRING
  }
 var body = JSON.stringify({
  "transaction_details": {
  "order_id": "ORDER-222222",
  "gross_amount": 10000
  }
})
  // Configure the request
  var options = {
      url: 'https://app.midtrans.com/snap/v1/transactions',
      // url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      method: 'POST',
      headers: headers,
      body : body
  }
  request(options, function (error, response, body) {

          // Print out the response body
        res.send(body);
  })

});
// router.route('/pay').post(function (req, res) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//       res.header("X-Frame-Options", "SAMEORIGIN, GOFORIT");
//       AUTH_STRING = "Basic VlQtc2VydmVyLUJRajkwYXVneks4R3FFTEpFeTQ2b25WQzo=";
//       const headers = {
//           'Accept':       'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': AUTH_STRING
//       }

//      var body = JSON.stringify(req.body);
//      var options = {
//         url: 'https://app.midtrans.com/snap/v1/transactions',
//         method: 'POST',
//         headers: headers,
//         body : body
//     }
//     request(options, function (error, response, body) {

//             // Print out the response body
//           res.send(body);
//     })

// });
// router.route('/getPaymentStatus').post(function (req, res) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//       res.header("X-Frame-Options", "SAMEORIGIN, GOFORIT");
//       AUTH_STRING = "Basic VlQtc2VydmVyLUJRajkwYXVneks4R3FFTEpFeTQ2b25WQzo=";
//       const headers = {
//           'Accept':       'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': AUTH_STRING
//       }

//     var body = JSON.stringify(req.body);
//     console.log(req.body.test);
//     var paymentStatusUrl = 'https://api.midtrans.com/v2/'+ req.body.test +'/status'
//     var options = {
//         url: paymentStatusUrl,
//         method: 'GET',
//         headers: headers
//     }
//     request(options, function (error, response, body) {

//             // Print out the response body
//           res.send(body);
//     })

// });

// router.route('/sendEmail').post(function(req, res){

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("X-Frame-Options", "SAMEORIGIN, GOFORIT");
//     var mailOpts, smtpTrans;
//     //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
//     smtpTrans = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: 'lesgoindonesiapintar@gmail.com',
//           pass: 'lesgo4321'
//         }
//       });
//     console.log(req);
//     //Mail options
//     mailOpts = {
//         from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
//         to: 'fikrizalwahyudi@gmail.com',
//         subject: 'Website contact form',
//         text: req.body.message
//     };
//     smtpTrans.sendMail(mailOpts, function (error, response) {
//         //Email not sent
//         if (error) {
//           console.log(error);
//             // res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Error occured, message not sent.', err: true, page: 'contact' })
//         }
//         //Yay!! Email sent
//         else {
//           console.log(response);
//             // res.render('contact', { title: 'Raging Flame Laboratory - Contact', msg: 'Message sent! Thank you.', err: false, page: 'contact' })
//         }
//     });
// })
module.exports = router;
