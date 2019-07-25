var express = require("express");
var request = require("request");
var cors = require("cors");

// Add your credentials:
// Add your client ID and secret
var CLIENT =
  "ASRih2RGJ7B0Lne6iwYthofA2MdijmoSbNXtUVnkM7uWm7aszDux4fmZfJjhM6TCzu0SjLhKxWtDK9bi";
var SECRET =
  "EE0hqnABcsx0ShYYrJWuIQF1HEfJp3l17nKpreQ1GMlgFX7Wfjgex6nzzLSRmjbFAmE9F7L9ZaSCj4lV";

const app = express();

app.use(cors());
app.use("/static", express.static(__dirname + "/public"));

var PAYPAL_API = "https://api.sandbox.paypal.com";

app.post("/my-api/create-payment/", function(req, res) {
  console.log("AAAAAAAAAAAAAAA", req.body);
  // 2. Call /v1/payments/payment to set up the payment
  request.post(
    PAYPAL_API + "/v1/payments/payment",
    {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        intent: "sale",
        payer: {
          payment_method: "paypal"
        },
        transactions: [
          {
            amount: {
              total: "5.99",
              currency: "BRL"
            }
          }
        ],
        redirect_urls: {
          return_url: "https://example.com",
          cancel_url: "https://example.com"
        }
      },
      json: true
    },
    function(err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      console.log("BBBBBBBBBBB", response.body);

      res.json({
        id: response.body.id
      });
    }
  );
});
// Execute the payment:
// 1. Set up a URL to handle requests from the PayPal button.
app.post("/my-api/execute-payment/", function(req, res) {
  // 2. Get the payment ID and the payer ID from the request body.
  console.log(req);
  console.log(req.body);
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  console.log("CCCCCCCCCCCCC", req.body);
  request.post(
    PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
    {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: "10.99",
              currency: "BRL"
            }
          }
        ]
      },
      json: true
    },
    function(err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 4. Return a success response to the client
      res.json({
        status: "success"
      });
    }
  );
});

app.listen(3000, function() {
  console.log("Server listening at http://localhost:3000/");
});
// Run `node ./server.js` in your terminal
