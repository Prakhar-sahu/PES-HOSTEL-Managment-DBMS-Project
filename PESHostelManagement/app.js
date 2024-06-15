const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const hbs = require('hbs');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const dbConnection = require('./database');
dotenv.config();
const app = express();
const http = require('http').Server(app);



const port = 3000;  
app.use(cors());
app.use(express.json()); 
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

const db = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
// APPLY COOKIE SESSION MIDDLEWARE 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge:  500 * 1000 //5 seconds
}));

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
      return res.render('login');
  }
  next();
}
const ifLoggedin = (req,res,next) => {
  if(req.session.isLoggedIn){
      return res.redirect('/');
  }
  next();
}
// END OF CUSTOM MIDDLEWARE

//connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
// app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.set("views", "./views");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/app-student-billing", (req, res) => {
  res.render("app-student-billing");
});
app.get('/add-student-warden', (req, res) => {
  let sql = "SELECT * FROM student";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('student_view.hbs', {
      results: results
    });
  });
});



app.get('/add-student-localguardian', ifNotLoggedin, (req, res) => {
  // Your existing code for fetching LocalGuardian data
  let sql1 = 'SELECT reg_no FROM usersstud WHERE id = ?';
  let values1 = [req.session.userID];

  db.query(sql1, values1, (err, results) => {
    if (err) {
      console.error('Error fetching reg_no:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    // console.log(results);
    // Check if a user with the given ID exists
    if (results.length > 0) {
      const reg_no = results[0].reg_no;

      // Fetch LocalGuardian records for the specific reg_no
      let sql2 = 'SELECT * FROM LocalGuardian WHERE reg_no = ?';
      let values2 = [reg_no];

      db.query(sql2, values2, (err, localGuardianResults) => {
        if (err) {
          console.error('Error fetching LocalGuardian data:', err.message);
          return res.status(500).send('Internal Server Error');
        }

        // Render the page with the LocalGuardian data
        res.render('studentGuardian_view.hbs', {
          results: localGuardianResults,
          reg_no: reg_no
        });
      });
    } else {
      // Handle the case when the user is not found
      res.status(404).send('User not found');
    }
  });
});



//route for insert data
app.post('/saveLocalGuardian', (req, res) => {
  
  
  let data = { guardian_name: req.body.guardian_name, reg_no: req.body.reg_no,  gender: req.body.gender, relation: req.body.relation, email_id: req.body.email_id, address: req.body.address,ph_no: req.body.ph_no};
  let sql = "INSERT INTO LocalGuardian SET ?";
  let query = db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect('/add-student-localguardian');
  }); 
});
   
//route for update data
app.post('/updateLocalGuardian', (req, res) => {
  let sql = "UPDATE LocalGuardian SET guardian_name='" + req.body.guardian_name + "',reg_no='" + req.body.reg_no + "',gender='" + req.body.gender + "', relation='" + req.body.relation + "',email_id='" + req.body.email_id + "',address='" + req.body.address + "' WHERE reg_no='" + req.body.reg_no + "'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/add-student-localguardian');
  });
}); 
 
//route for delete data
app.post('/deleteLocalGuardian', (req, res) => {
  let sql = "DELETE FROM LocalGuardian WHERE reg_no='" + req.body.reg_no + "'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/add-student-localguardian');
  });
});

//route for insert data

// app.post('/save', (req, res) => {
//   let data = {
//     reg_no: req.body.reg_no,
//     room_no: req.body.room_no,
//     block_id: req.body.block_id,
//     stud_name: req.body.stud_name,
//     gender: req.body.gender,
//     dob: req.body.dob,
//     blood_group: req.body.blood_group,
//     email_id: req.body.email_id,
//     address: req.body.address,
//     father_name: req.body.father_name,
//     mother_name: req.body.mother_name,
//     parent_email: req.body.parent_email,
//     course_id: req.body.course_id,
//     bed_no: req.body.bed_no  // Added the 'bed_no' field
//   };

//   let sql = "INSERT INTO Student SET ?";
//   let query = db.query(sql, data, (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Error occurred while inserting data.");
//     } else {
//       res.redirect('/add-student-warden');
//     }
//   });
// });

app.post('/save', (req, res) => {
  console.log(req.body);

  let roomCheckQuery = 'SELECT status FROM room WHERE block_id = ? AND room_no = ? AND beds_no = ?';
  let roomCheckData = [req.body.block_id, req.body.room_no, req.body.bed_no];

  db.query(roomCheckQuery, roomCheckData, (roomCheckErr, roomCheckResults) => {
    if (roomCheckErr) {
      console.log(roomCheckErr);
      res.status(500).send('Error occurred while checking room availability.');
      return;
    }

    if (roomCheckResults.length > 0 && roomCheckResults[0].status === 'empty') {
      let data = {
        reg_no: req.body.reg_no,
        room_no: req.body.room_no,
        block_id: req.body.block_id,
        stud_name: req.body.stud_name,
        gender: req.body.gender,
        dob: req.body.dob,
        blood_group: req.body.blood_group,
        email_id: req.body.email_id,
        address: req.body.address,
        father_name: req.body.father_name,
        mother_name: req.body.mother_name,
        parent_email: req.body.parent_email,
        course_id: req.body.course_id,
        bed_no: req.body.bed_no,
      };

      let sql = 'INSERT INTO student SET ?';
      let query = db.query(sql, data, (insertErr, insertResults) => {
        if (insertErr) {
          console.log(insertErr);
          res.status(500).send('Error occurred while inserting data.');
        } else {
          let updateRoomQuery = 'UPDATE room SET status = \'occupied\' WHERE block_id = ? AND room_no = ? AND beds_no = ?';
          let updateRoomData = [req.body.block_id, req.body.room_no, req.body.bed_no];

          db.query(updateRoomQuery, updateRoomData, (updateRoomErr, updateRoomResults) => {
            if (updateRoomErr) {
              console.log(updateRoomErr);
              res.status(500).send('Error occurred while updating room data.');
            } else {
              res.redirect('/add-student-warden');
            }
          });
        }
      });
    } else {
      res.status(400).send('Room does not exist or has no available beds.');
    }
  });
});
















   
//route for update data
app.post('/update', (req, res) => {
  let sql = "UPDATE Student SET reg_no = ?, room_no = ?, block_id = ?, stud_name = ?, gender = ?, dob = ?, blood_group = ?, email_id = ?, address = ?, father_name = ?, mother_name = ?, parent_email = ?, course_id = ?, bed_no = ? WHERE reg_no = ?";

  let data = [
      req.body.reg_no,
      req.body.room_no,
      req.body.block_id,
      req.body.stud_name,
      req.body.gender,
      req.body.dob,
      req.body.blood_group,
      req.body.email_id,
      req.body.address,
      req.body.father_name,
      req.body.mother_name,
      req.body.parent_email,
      req.body.course_id,
      req.body.bed_no,
      req.body.reg_no  // Use this to identify the specific student to update
  ];

  let query = db.query(sql, data, (err, results) => {
      if (err) throw err;
      res.redirect('/add-student-warden');
  });
});

 
//route for delete data
app.post('/delete', (req, res) => {
  let sql = "DELETE FROM Student WHERE reg_no='" + req.body.reg_no + "'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/add-student-warden');
  });
});


app.get('/add-warden-chiefwarden', (req, res) => {
  let sql = "SELECT * FROM Staff";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('warden_view.hbs', {
      results: results
    });
  });
});

//route for insert data
app.post('/saveStaff', (req, res) => {
  let data = { staff_id: req.body.staff_id, staff_name: req.body.staff_name, gender: req.body.gender, dob: req.body.dob, email_id: req.body.email_id, staff_role: req.body.staff_role, salary: req.body.salary };
  let sql = "INSERT INTO Staff SET ?";
  let query = db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect('/add-warden-chiefwarden');
  });
});

//route for update data
app.post('/updateStaff', (req, res) => {
  let sql = "UPDATE Staff SET staff_id='" + req.body.staff_id + "',staff_name='" + req.body.staff_name + "', gender='" + req.body.gender + "',dob='" + req.body.dob + "',email_id='" + req.body.email_id + "',staff_role='" + req.body.staff_role + "',salary='" + req.body.salary + "' WHERE staff_id='" + req.body.staff_id + "'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/add-warden-chiefwarden');
  });
});

//route for delete data
app.post('/deleteStaff', (req, res) => {
  let sql = "DELETE FROM Staff WHERE staff_id='" + req.body.staff_id + "'";
  // console.log(sql)
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/add-warden-chiefwarden');
  });
});

      
app.get('/outing-request', ifNotLoggedin, (req, res) => {
  // Your existing code for fetching reg_no from usersstud
  let sql1 = 'SELECT reg_no FROM usersstud WHERE id = ?';
  let values1 = [req.session.userID];

  db.query(sql1, values1, (err, results1) => {
    if (err) {
      console.error('Error fetching reg_no:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    // Check if a user with the given ID exists
    if (results1.length > 0) {
      const reg_no = results1[0].reg_no;

      // Fetch outings for the specific reg_no
      let sql2 = 'SELECT * FROM outing WHERE reg_no = ?';
      let values2 = [reg_no];

      db.query(sql2, values2, (err, outingResults) => {
        if (err) {
          console.error('Error fetching outing data:', err.message);
          return res.status(500).send('Internal Server Error');
        }

        // Render the page with the outing data and reg_no
        res.render('outing_view_student.hbs', {
          results: outingResults,
          reg_no: reg_no
        });
      });
    } else {
      // Handle the case when the user is not found
      res.status(404).send('User not found');
    }
  });
});

//route for insert student outing data
app.post('/request', (req, res) => {
  // console.log(req.body);
  let data = { reg_no: req.body.reg_no, outing_type: req.body.outing_type, purpose: req.body.purpose, out_date_time: req.body.out_date_time, expectedin_date_time: req.body.expectedin_date_time, actualin_date_time: req.body.actualin_date_time};
  let sql = "INSERT INTO outing SET ?";
  let query = db.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect('/outing-request');
  }); 
});
   
//route for update student outing actual intime
app.post('/updateTime', (req, res) => {
  let sql = "UPDATE Outing SET actualin_date_time='" + req.body.actualin_date_time + "'";  
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/outing-request');
  }); 
});


// Route for displaying outing details
app.get('/outing-grant', ifNotLoggedin, (req, res) => {
  // Fetch staff_id for the current user
  let sql = 'SELECT staff_id FROM users WHERE id = ?';
  let values = [req.session.userID];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching staff_id:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    // Check if a user with the given ID exists
    if (results.length > 0) {
      const staff_id1 = results[0].staff_id;
      // console.log("prinintg");
      // console.log(staff_id);

      // Fetch outing details
      let sqlOuting = "SELECT * FROM outing";
      db.query(sqlOuting, (err, outingResults) => {
        if (err) throw err;

        // Render the HTML page with outing details and staff_id
        res.render('outing_view_warden.hbs', {
          results: outingResults,
          staff_id1: staff_id1
        });
      });
    } else {
      // Handle the case when the user is not found
      res.status(404).send('User not found');
    }
  });
});

// Route for handling grant gatepass
app.post('/grant', (req, res) => {
  // Extract values from the request body
  // print("printing");
  // print(req.body);
  console.log("prinintg");
  console.log(req.body);
  const gatepassId = req.body.id;
  const currentStatus = req.body.current_status;
  const staffId = req.body.staff_id1; // Added staff_id from the form
  // console.log("print");
  // console.log(staffId);

  // Update the outing table with the staff_id and current_status
  let sql = `UPDATE outing SET current_status='${currentStatus}', staff_id='${staffId}' WHERE gatepass_id=${gatepassId}`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/outing-grant');
  });
});




// Route for updating the checking time (Check-In)
app.post('/checkin', (req, res) => {
  // Get the gatepass ID from the form
  console.log("inside checking");
  console.log(req.body);
  const gatepassId = req.body.id;

  // Update the actualin_date_time to the current timestamp
  let sql = `UPDATE outing SET actualin_date_time=NOW() WHERE gatepass_id=${gatepassId}`;
  
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/outing-grant');
  });
});



app.get("/pricing", (req, res) => {
  res.render("pricing");
});


app.get('/add-student-complaint',ifNotLoggedin, (req, res) => {
  // Get staff_id based on the user's session ID
  const userID = req.session.userID;
  const query1 = 'SELECT reg_no FROM usersstud WHERE id = ?';
  
  db.query(query1, [userID], (err, reg_no_result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving staff ID from the database');
      return;
    }

    const reg_no = reg_no_result[0].reg_no;
    console.log(reg_no);
    res.render('add-student-complaint.hbs',{
      reg_no:reg_no
  });
   
  });
});

// Insert data into the complaint table
app.post('/add-complaint', (req, res) => {
  // console.log(req.body);
  const imageBuffer = req.body.picture;
  const clobData = imageBuffer.toString('base64');
  const data = {
      complaint_date: req.body.complaint_date,
      resolve_date: null, // Set to null
      status: 'pending', // Default value
      type: req.body.type,
      description: req.body.description,
      picture: clobData,
      // staff_id: null, // Default value
      student_ref_no: req.body.reg_no,
  };
  // console.log(req.body);


  const sql = 'INSERT INTO complaint SET ?';
  db.query(sql, data, (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error occurred while inserting data.');
      } else {
          // Redirect to the fetch complaint page with the reg_no parameter
          res.redirect('/fetch-complaints/' + req.body.reg_no);
      }
  });
});
app.get('/fetch-complaints/:reg_no', (req, res) => {
  const reg_no = req.params.reg_no;

  const sql = 'SELECT * FROM complaint WHERE student_ref_no = ?';
  db.query(sql, [reg_no], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error occurred while fetching data.');
      } else {
          res.json(results);
      }
  });
});



// Assuming you have session middleware configured
app.get('/warden-complaint',ifNotLoggedin, (req, res) => {
  // Get staff_id based on the user's session ID
  const userID = req.session.userID;
  const getStaffIdQuery = 'SELECT staff_id FROM users WHERE id = ?';
  
  db.query(getStaffIdQuery, [userID], (err, staffResult) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving staff ID from the database');
      return;
    }

    const staff_id1 = staffResult[0].staff_id;

    // Query to retrieve data from the 'complaint' table
    let sql = "SELECT * FROM complaint";
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
        return;
      }

      // Process the results and convert the image data to Base64
      const imageList = results.map((row) => {
        if (row.picture) {
          const bufferData = Buffer.from(row.picture);
          const base64ImageData = bufferData.toString('base64');
          row.picture = `data:image/jpeg;base64,${base64ImageData}`;
        }
        return row;
      });

      // Render the Handlebars template and pass the data and staff_id
      res.render('warden-complaint.hbs', {
        results: imageList,
        staff_id1: staff_id1,
      });
    });
  });
});

// Modify the post request to include staff_id
app.post('/update-status', (req, res) => {
  // console.log(req.body);
  const { complaint_id, staff_id1 } = req.body;

  // Update the Status, Resolve Date, and Staff ID in the database
  const sql = 'UPDATE complaint SET status = "resolved", resolve_date = CURRENT_TIMESTAMP(), staff_id = ? WHERE complaint_id = ?';
  db.query(sql, [staff_id1, complaint_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while marking the complaint as resolved.');
    } else {
      res.send('Complaint marked as resolved successfully.');
    }
  });
});



app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/loginStud", (req, res) => {
  console.log("rendering loginstud");
  res.render("loginStud");
});
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});
app.get("/sign-upStud", (req, res) => {
  res.render("sign-upStud");
});
app.get('/website-student-dashboard', ifNotLoggedin, (req,res,next) => {
  // console.log(req.session.student_ref_no);
  // console.log(req.session);
  dbConnection.execute("SELECT `name` FROM `usersStud` WHERE `id`=?",[req.session.userID])
  .then(([rows]) => {
      res.render('website-student-dashboard',{
          name:rows[0].name
      });
  });
  
});


    
app.get("/website-chiefwarden-dashboard", (req, res) => {
  res.render("website-chiefwarden-dashboard");
});
 
app.get('/website-warden-dashboard', ifNotLoggedin, (req,res,next) => {
  // console.log(req.session);
  dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
  .then(([rows]) => {
      res.render('website-warden-dashboard',{
          name:rows[0].name
      });
  });
  
});





app.post('/register', ifLoggedin,
    // post data validation(using express-validator)
    [
        body('user_email', 'Invalid email address!').isEmail().custom((value) => {
            return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
                .then(([rows]) => {
                    if (rows.length > 0) {
                        return Promise.reject('This E-mail already in use!');
                    }
                    return true;
                });
        }),
        body('user_name', 'Username is Empty!').trim().not().isEmpty(),
        body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
        body('user_staff_id', 'Staff ID is Empty!').trim().not().isEmpty(),
    ],// end of post data validation
    (req, res, next) => {

        const validation_result = validationResult(req);
        const { user_name, user_pass, user_email, user_staff_id } = req.body;

        // IF validation_result HAS NO ERROR
        if (validation_result.isEmpty()) {
            // password encryption (using bcryptjs)
            bcrypt.hash(user_pass, 12).then((hash_pass) => {
                // INSERTING USER INTO DATABASE
                dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`, `staff_id`) VALUES(?,?,?,?)", [user_name, user_email, hash_pass, user_staff_id])
                    .then(result => {
                        res.send(`Your account has been created successfully, Now you can <a href="/login">Login</a>`);
                    }).catch(err => {
                        // THROW INSERTING USER ERROR'S
                        if (err) throw err;
                    });
            })
                .catch(err => {
                    // THROW HASING ERROR'S
                    if (err) throw err;
                })
        } else {
            // COLLECT ALL THE VALIDATION ERRORS
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // REDERING login-register PAGE WITH VALIDATION ERRORS
            res.render('sign-up', {
                register_error: allErrors,
                old_data: req.body
            });
        }
    }
);// END OF REGISTER PAGE






//Registration page for student 



// Your existing middleware functions (ifLoggedin, ifNotLoggedin)

app.post('/registerStud',
    // Post data validation (using express-validator)
    [
        body('user_email', 'Invalid email address!').isEmail().custom((value) => {
            return dbConnection.execute('SELECT `email` FROM `usersStud` WHERE `email`=?', [value])
                .then(([rows]) => {
                    if (rows.length > 0) {
                        return Promise.reject('This E-mail already in use!');
                    }
                    return true;
                });
        }),
        body('user_name', 'Username is Empty!').trim().not().isEmpty(),
        body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
        body('reg_no', 'Registration Number is required').trim().not().isEmpty(),
    ],
    // End of post data validation
    (req, res, next) => {
        const validation_result = validationResult(req);
        const { user_name, user_pass, user_email, reg_no } = req.body;

        // If validation_result has no error
        if (validation_result.isEmpty()) {
            // Password encryption (using bcryptjs)
            bcrypt.hash(user_pass, 12).then((hash_pass) => {
                // Inserting user into the database
                dbConnection.execute("INSERT INTO `usersStud`(`name`,`email`,`password`, `reg_no`) VALUES(?,?,?,?)", [user_name, user_email, hash_pass, reg_no])
                    .then(result => {
                        res.send(`Your account has been created successfully, Now you can <a href="/loginStud">Login</a>`);
                    }).catch(err => {
                        // Throw inserting user error's
                        if (err) throw err;
                    });
            })
                .catch(err => {
                    // Throw hashing error's
                    if (err) throw err;
                })
        } else {
            // Collect all the validation errors
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // Rendering sign-upStud page with validation errors
            res.render('sign-upStud', {
                register_error: allErrors,
                old_data: req.body
            });
        }
    });
// END OF REGISTER PAGE

// LOGIN PAGE 
app.post('/signin',  [
  body('user_email').custom((value) => {
      return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
      .then(([rows]) => {
          if(rows.length == 1){
              return true;
              
          }
          return Promise.reject('Invalid Email Address!');
          
      });
  }),
  body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
  const validation_result = validationResult(req);
  const {user_pass, user_email} = req.body;
  if(validation_result.isEmpty()){
      
      dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
      .then(([rows]) => {
          // console.log(rows[0].password);
          bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
              if(compare_result === true){
                  req.session.isLoggedIn = true;
                  req.session.userID = rows[0].id;

                  res.redirect('/website-warden-dashboard');
              }
              else{
                  res.render('sign-up',{
                      login_errors:['Invalid Password!']
                  }); 
              }
          })
          .catch(err => {
              if (err) throw err;
          });


      }).catch(err => {
          if (err) throw err;
      });
  }
  else{
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render('sign-up',{
          login_errors:allErrors
      });
  }
});
// END OF LOGIN PAGE


// LOGIN PAGE for student
app.post('/signinStud',  [
  body('user_email').custom((value) => {
      return dbConnection.execute('SELECT `email` FROM `usersStud` WHERE `email`=?', [value])
      .then(([rows]) => {
          if(rows.length == 1){
              return true;
              
          }
          return Promise.reject('Invalid Email Address!');
          
      });
  }),
  body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
  console.log("inside post");
  const validation_result = validationResult(req);
  const {user_pass, user_email} = req.body;
  if(validation_result.isEmpty()){
      
      dbConnection.execute("SELECT * FROM `usersStud` WHERE `email`=?",[user_email])
      .then(([rows]) => {
          // console.log(rows[0].password);
          bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
              if(compare_result === true){
                  req.session.isLoggedIn = true;
                  req.session.userID = rows[0].id;
                  console.log("hello i am in ");

                  res.redirect('/website-student-dashboard');
              }
              else{
                  res.render('sign-up',{
                      login_errors:['Invalid Password!']
                  }); 
              }
          })
          .catch(err => {
              if (err) throw err;
          });


      }).catch(err => {
          if (err) throw err;
      });
  }
  else{
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render('sign-upStud',{
          login_errors:allErrors
      });
  }
});
// END OF LOGIN PAGE for student


app.get("/get_messages", function (request, result) {
	db.query("SELECT * FROM messages", function (error, messages) {
		result.end(JSON.stringify(messages));
	});
});

//Complaint Raise Code

// io.on("connection", function (socket) {
// 	console.log("socket connected = " + socket.id);

// 	socket.on("delete_complaint", function (id) {
// 	//	console.log('time to delete');
// 		db.query("DELETE FROM Complaints WHERE id = '" + id + "'", function (error, result) {
// 			io.emit("delete_complaint", id);
// 		});
// 	});    
          
// 	socket.on("new_complaint", function (data) {
// 		console.log("Client says", data)

	
// 		io.emit("new_complaint", data);

// 		db.query("INSERT INTO Complaints(complaint) VALUES('" + data + "')", function (error, result) {
// 			data.id = result.insertId; 
// 			io.emit("new_complaint", {
// 				id: result.insertId,
// 				complaint: data
// 			})
// 		});
// 	});
// });

app.get("/get_complaint", function (request, result) {
	db.query("SELECT * FROM Complaints", function (error, Complaints) {
		result.end(JSON.stringify(Complaints));
	});
});

// LOGOUT
app.get('/logout',(req,res)=>{
  //session destroy
  req.session = null;
  res.redirect('/');
});
// END OF LOGOUT

app.get('/add-absent', (req, res) => {
  let sql = "SELECT * FROM attendance";
  // console.log(sql);
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    // console.log(results);
    res.render('add_absent.hbs', {
      results: results
    });
  });
});

app.post('/add_absentee', async (req, res) => {
  // console.log(req.body);
  const reg_no = req.body.reg_no;
  const date = req.body.date;

  // Insert the new absentee into the database
  const result = await db.query('INSERT INTO attendance (reg_no, date) VALUES (?, ?)', [reg_no, date]);

  // Redirect the user back to the attendance page
  res.redirect('/add-absent');
});
app.post('/attendance-report', (req, res) => {
  // console.log(req.body);
  const { procedureName, year, month } = req.body;
  
  if (procedureName) {
    // Call the stored procedure based on the procedureName
    const query = `CALL ${procedureName}(?, ?)`;
    db.query(query, [year, month], (error, results) => {
      if (error) {
        console.error('Error calling the stored procedure:', error);
        // res.render('', { error: 'Error calling the stored procedure', results: null });
      } else {
        // console.log('Stored procedure executed successfully');
        res.render('report_result', { error: null, results: results[0] });
      }
    });
  } else {
    res.render('attendace_report', { error: 'Procedure name is required', results: null });
  }
});

app.get('/call', (req, res) => {
  res.render('attendance_report', { error: null, results: null });
});

app.get('/get-room-status', (req, res) => {
  res.render('room_status');
});

app.post('/status', (req, res) => {
  const { check_block_id, check_status } = req.body;
  const query = 'CALL GetRoomsByStatus(?, ?)';
  
  db.query(query, [check_block_id, check_status], (error, results) => {
    if (error) {
      console.error('Error calling the stored procedure:', error);
      res.render('room_status', { error: 'Error calling the stored procedure', results: null });
    } else {
      // console.log('Stored procedure executed successfully');
      res.render('room_status_result', { error: null, results: results[0] });
    }
  });
});

app.get('/student-count', (req, res) => {
  res.render('student_count');
});

app.post('/student-count-result', (req, res) => {
  // console.log(req.body);
  const { gender } = req.body;
  const query = 'SELECT GetStudentCountByGender(?) AS studentCount';

  db.query(query, [gender], (error, results) => {
    if (error) {
      console.error('Error calling the function:', error);
      res.render('student_count_result', { error: 'Error calling the function', studentCount: null });
    } else {
      // console.log('Function executed successfully');
      // console.log(results[0]);
      res.render('student_count_result', { error: null, studentCount: results[0].studentCount });
    }
  });
});

app.post('/room-occupancy-result', (req, res) => {
  // console.log(req.body);
  const { room_no, block_id } = req.body;
  const query = 'SELECT IsRoomOccupied(?, ?) AS isOccupied';

  db.query(query, [room_no, block_id], (error, results) => {
    if (error) {
      console.error('Error calling the function:', error);
      res.render('room_occupancy_result', { error: 'Error calling the function', isOccupied: null });
    } else {
      // console.log('Function executed successfully');
      res.render('room_occupancy_result', { error: null, isOccupied: results[0].isOccupied });
    }
  });
});



app.get('/room-occupancy', (req, res) => {
  res.render('room_occupancy');
});

app.get('/add-ph-no', (req, res) => {
  res.render('ph_no');
});

app.post('/added-ph', (req, res) => {
  const regNo = req.body.regNo;
  const phNumbers = Array.isArray(req.body['phNumbers[]'])
    ? req.body['phNumbers[]']
    : [req.body['phNumbers[]']];

  // console.log(req.body);

  // Insert data into the database
  const insertQuery = 'INSERT INTO student_ph (reg_no, ph_no) VALUES (?, ?)';

  phNumbers.forEach((phNumber) => {
    db.query(insertQuery, [regNo, phNumber], (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
    });
  });

  res.redirect('/add-student-warden');
});
app.get('/get-ph-no', (req, res) => {
  res.render('get_ph_no', { phoneNumbers: null, error: null });
});

app.post('/get-ph-post', (req, res) => {
  const regNo = req.body.regNo;

  // Call the stored procedure
  const callProcedure = 'CALL GetPhoneNumbersByRegNo(?)';

  db.query(callProcedure, [regNo], (err, results) => {
      if (err) {
          console.error('Error calling stored procedure:', err);
          res.render('getPhoneNumbers', { phoneNumbers: null, error: 'Error retrieving phone numbers.' });
      } else {
          const phoneNumbers = results[0].map(result => result.ph_no);
          res.render('get_ph_post', { phoneNumbers, error: null });
      }
  });
});

// Route to render the input form
app.get('/join-query', (req, res) => {
  res.render('join_query');
});

// Route to handle form submission and trigger the query
app.post('/join-query-post', (req, res) => {
  const { block_id, status } = req.body;

  const sql = `
    SELECT student.stud_name, student.room_no, student.block_id, complaint.complaint_date, complaint.type, complaint.description
    FROM student
    JOIN complaint ON student.reg_no = complaint.student_ref_no
    WHERE student.block_id = ? AND complaint.status = ?
  `;

  db.query(sql, [block_id, status], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('join_query_result', { results });
  });
});



// Route to render the input form
app.get('/get-emails', (req, res) => {
  res.render('emails');
});

// Route to handle form submission and trigger the query
app.post('/emails-result', (req, res) => {
  const specificDate = req.body.date;

  const query = `
    SELECT
      student.stud_name,
      student.reg_no,
      student.parent_email,
      localguardian.email_id AS guardian_email
    FROM
      student
      JOIN localguardian ON student.reg_no = localguardian.reg_no
    WHERE
      student.reg_no IN (
        SELECT
          attendance.reg_no
        FROM
          attendance
        WHERE
          attendance.date = ?
      );
  `;

  db.query(query, [specificDate], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('emails_result', { results });
  });
});


app.get('/count', (req, res) => {
  const query = `
    SELECT course_id, SUM(attendance_count) AS total_attendances
    FROM (
        SELECT s.course_id, COUNT(*) AS attendance_count
        FROM student s
        JOIN attendance a ON s.reg_no = a.reg_no
        GROUP BY s.course_id
    ) AS course_attendances
    GROUP BY course_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('count', { results });
  });
});

app.get('/lg', (req, res) => {
  const query = `
    SELECT s.reg_no, s.stud_name, s.address AS student_address,
           lg.guardian_name, lg.address AS lg_address
    FROM student s
    JOIN localguardian lg ON s.reg_no = lg.reg_no
    WHERE lg.address LIKE '%bangalore%';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('lg.hbs', { results: results });
  });
});







// set the app to listen on the port
http.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
      