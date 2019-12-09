"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

/** date configuration**/
const dateMin = "2019-12-01";
const dateMax = "2024-11-30";
function isValidDateFormat(date) {
  return /\d\d\d\d-\d\d-\d\d/.test(date);
}
function isValidDateRange(date) {
  let dateISO = new Date(date);
  return dateISO <= new Date(dateMax) && dateISO >= new Date(dateMin);
}

/** use SHA1 **/
var crypto = require("crypto");
function get_hash(plaintext) {
  var hashsum = crypto.createHash("sha1");
  hashsum.update(plaintext);
  return hashsum.digest("hex");
}

/** mongoose configuration**/
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MLAB_URI || "mongodb://localhost/exercise-track", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log(mongoose.connection.readyState);

var Schema = mongoose.Schema;

/** userModel**/
var userSchema = new Schema({
  name: { type: String, required: true },
  hash: String
});
const User = mongoose.model("User", userSchema);

/** logModel**/
var logSchema = new Schema({
  hash: { type: String, required: true },
  description: String,
  duration: Number,
  date: {
    type: Date,
    min: dateMin,
    max: dateMax
  }
});
const Log = mongoose.model("Log", logSchema);

// var createUser = new User({ name: 'takashi', hash: get_hash("mydata") });
// createUser.save(function(err, data) {
//   if (err) return console.error(err);
//   console.log(data);
// });

/** sample log **/
// const createLog = new Log({
//   hash: get_hash("my_data"),
//   description: "This is sample",
//   duration: "30",
//   date: "2019-12-06"
// });
//  createLog.save(function(err, data) {
//   if (err) return console.error(err);
//   console.log(data);
// });
// Log.findOne({date: '2019-12-06'}, function(err, data) {
//   if (err) console.error(err);
//   console.log(data.date.toString());
// });
// if true, undefined
//console.log(sample.validateSync());

/** Here is for a different solution (using different Model).   **/
/** There are one Model(collection) which has a field : {log : [objects]}.  **/
/** Since this structure made me use "aggregate", but I didn't understand it
so that I did alter solution in this project.**/
// var createAndSave = function() {
//   var kokko = new User({
//     name: "kokko",
//     log: [
//       { description: "second task!", duration: 60, date: "2019-12-06" },
//       { description: "second task!", duration: 30, date: "2019-12-06" },
//       { description: "third task!", duration: 30, date: "2019-12-05" },
//       { description: "first task!", duration: 50, date: "2019-12-05" },
//       { description: "third task!", duration: 30, date: "2019-12-05" }
//     ]
//   });
//   kokko.save(function(err, data) {
//     if (err) return console.error(err);
//     console.log(data);
//   });
// };
//createAndSave();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/** my solution start **/

/** check if the url exists? **/
var findUserByName = function(name) {
  return new Promise((resolve, reject) => {
    User.findOne({ name: name }, function(err, data) {
      if (err) return console.error(err);
      resolve(data);
    });
  });
};

/** Save the posted username**/
var createAndSaveUser = function(name, hash) {
  return new Promise((resolve, reject) => {
    // create
    var createUser = new User({ name: name, hash: hash });
    // save
    createUser.save(function(err, data) {
      if (err) return console.error(err);
      if (data !== null && data !== undefined) {
        resolve(data);
      } else {
      }
    });
  });
};

/** Save the posted log**/
var createAndSaveLog = function(hash, description, duration, date) {
  return new Promise((resolve, reject) => {
    // create a document
    var createLog = new Log({
      hash: hash,
      description: description,
      duration: duration,
      date: date
    });
    // save
    createLog.save(function(err, data) {
      if (err) console.error(err);
      resolve(data);
    });
  });
};

/** Create a New User **/
app.post("/api/exercise/new-user", function(req, res) {
  // find, create and save , then output
  findUserByName(req.body.username).then(found => {
    if (found !== null && found !== undefined) {
      res.end("the username has already used");
    } else {
      createAndSaveUser(req.body.username, get_hash(req.body.username)).then(user =>
        res.json({ username: user.name, _id: user.hash })
      );
    }
  });
});

/** Get Registerd Users **/
app.get("/api/exercise/users", function(req, res) {
  User.find({}, function(err, data) {
    if (err) console.error(err);
    res.json(data);
  });
});
/** Add exercises with UserID**/
app.post("/api/exercise/add", function(req, res) {
  // req.body : { userId, description, duration, date }

  let description = req.body.description;
  let duration = Number(req.body.duration);
  let date;
  let hash = req.body.userId;

  /** initialization **/
  const p = new Promise((resolve, reject) => {
    if (isNaN(duration)) reject("invalid duration (e.g. '15' is valid)");
    if (!req.body.date) {
      date = new Date();
    } else if (!isValidDateFormat(req.body.date)) {
      reject("invalid date (correct: YYYY-MM-DD)");
    } else {
      if (!isValidDateRange) {
        reject("valid date range (from:" + dateMin + ", to: " + dateMax + ")");
      } else {
        date = new Date(req.body.date);
      }
    }
    // waiting : if not waiting, promise is being pending.
    setTimeout(function() {
      resolve();
    }, 1);
  });

  /** find, create and save log(exercise), then output**/
  p.then(
    () => {
      // resolve
      User.findOne({ hash: hash }, (err, found) => {
        if (err) return console.error(err);
        if (found === null || found === undefined) {
          res.end("unknown _id");
        } else {
          createAndSaveLog(hash, description, duration, date).then(data => {
            res.json({
              _id: found.hash,
              username: found.name,
              description: data.description,
              duration: data.duration,
              date: data.date.toString().slice(0, 15)
            });
          });
        }
      });
    },
    // reject
    reason => res.end(reason)
  );
});

/** Get Registerd Logs With Optional Conditions (from, to, limit)**/
///api/exercise/log?&userId=28229485665f96e033333c22c3bdb508daefca17
//GET /api/exercise/log?{userId}[&from][&to][&limit]
app.get("/api/exercise/log", function(req, res) {
  const hash = req.query.userId;
  let limit;
  let query = { hash: hash };
  let ltgt = {};
  let to = req.query.to;
  let from = req.query.from;
  // query example :
  //   { hash: hash, date: { $lt: date, $gt: date } }
  //   { hash: hash, date: {
  //                  '$lte': new Date("2019-12-10"),
  //                  '$gte': new Date("2019-12-5") } }

  /** initialization **/
  const p = new Promise((resolve, reject) => {
    limit = isNaN(req.query.limit) ? undefined : parseInt(req.query.limit, 10);
    if (from) {
      if (!isValidDateFormat(from)) {
        reject("valid date format (valid : YYYY-MM-DDDD)");
      } else {
        if (!isValidDateRange(from)) {
          reject("valid date range (from :" + dateMin + ")");
        } else {
          ltgt.$gte = new Date(from);
        }
      }
    }
    if (to) {
      if (!isValidDateFormat(to)) {
        reject("valid date format (valid : YYYY-MM-DDDD)");
      } else {
        if (!isValidDateRange(to)) {
          reject("valid date range (to :" + dateMax + ")");
        } else {
          ltgt.$lte = new Date(to);
        }
      }
    }

    // if(Object.keys(ltgt).length )
    if (ltgt.$lte || ltgt.$gte) {
      query.date = ltgt;
    }
    // waiting
    setTimeout(function() {
      resolve();
    }, 1);
  });

  /** find with optional conditions (from, to, limit) **/
  p.then(
    // resolve
    () => {
      User.findOne({ hash: hash }, function(err, found) {
        if (err) return console.error(err);
        if (found === null || found === undefined) {
          res.end("unknown id");
        } else {
          Log.find(query)
            .limit(limit)
            .exec((err, data) => {
              if (err) console.error(err);
              res.json({
                username: found.name,
                _id: found.hash,
                from: from,
                to: to,
                limit: limit,
                log: data
              });
            });
        }
      });
    },
    // reject
    reason => res.end(reason)
  );
});

/** my solution end**/

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
