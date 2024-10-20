import express from "express";
import session from "express-session"; // Import express-session
import usersRouter from "./routes/users.js";
import bodyParser from "body-parser";
import pool from "./db.js";
import path from "path";
import url from "url";
// import ejs from "ejs";
import Swal from 'sweetalert2';

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
// Static folder to serve HTML
app.use(express.static("public"));
app.use(express.static("public/assets"));

const staticPath = path.join(
  url.fileURLToPath(import.meta.url),
  "../views"
);
app.use(express.static(staticPath));
app.use(express.json());

app.use(session({
    secret: 'kiattikoonasdasd',  // Replace 'yourSecretKey' with an actual secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set secure: true if using HTTPS
  }));
// Routes
app.use("/users", usersRouter);


// Serve index.ejs at the root path
app.get("/", (req, res) => {
  const checkStatusSessions = req.session.user;

  if (checkStatusSessions) {
    // If the session exists, check the user's status and redirect accordingly
    if (checkStatusSessions.status === 'teacher') {
      return res.redirect('/teacherHome');
    } else if (checkStatusSessions.status === 'admin') {
      return res.redirect('/homepage');
    }
  }
    res.render(path.join(staticPath, 'index.ejs'));
});

// app.get('/teacherSys', (req, res) => {
//   console.log(req.session.user);
//   const checkStatusSessions = req.session.user;
//   if (checkStatusSessions.status === 'teacher') {
//     return res.redirect('/teacherHome'); // Redirect to teacherhomepage if have logged in
//   } if (checkStatusSessions.status === 'admin') {
//     return res.redirect('/homepage'); // Redirect to homepage if have logged in
//   } if (!checkStatusSessions) {
//     return res.redirect('/');
//   }
//     res.render(path.join(staticPath, 'teacherSys.ejs'));
    
// });

// Protected route for teachers (e.g., teacher's page)
app.get('/teacherSys', (req, res) => {
  const checkStatusSessions = req.session.user;

  if (checkStatusSessions) {
    // If the session exists, check the user's status and redirect accordingly
    if (checkStatusSessions.status === 'teacher') {
      return res.redirect('/teacherHome');
    } else if (checkStatusSessions.status === 'admin') {
      return res.redirect('/homepage');
    }
  }

  // If no session exists (first time visit), do nothing - just load the current page
  res.render(path.join(staticPath, 'teacherSys.ejs'));
});


// app.get('/login', (req, res) => {
//   // Show the login page without checking for session initially
//   res.render(path.join(staticPath, 'login.ejs'));
// });


// Add homepage route
app.get('/homepage', (req, res) => {

  if (!req.session.user) {
      return res.redirect('/'); // Redirect to login if not logged in
    }
    const checkStatusSessions = req.session.user;

    if (checkStatusSessions) {
      // If the session exists, check the user's status and redirect accordingly
      if (checkStatusSessions.status === 'teacher') {
        return res.redirect('/teacherHome');
      } else if (checkStatusSessions.status === 'admin') {
        res.render('homepage', { teacherName: req.session.user.firstname });
      }
    }
    // res.render('homepage', { teacherName: req.session.user.firstname });
});

// Add teacherPage route
app.get('/teacherHome', (req, res) => {
if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }

  const checkStatusSessions = req.session.user;

  if (checkStatusSessions) {
    // If the session exists, check the user's status and redirect accordingly
    if (checkStatusSessions.status === 'teacher') {

      res.render('teacherHome', { 
        teacherName: req.session.user.firstname,
        teacherLName: req.session.user.lastname
       });

    } else if (checkStatusSessions.status === 'admin') {

      return res.redirect('/homepage');
    }
  }

  // res.render('teacherHome', { teacherName: req.session.user.firstname });
});


// Logout route to destroy session
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Unable to log out.");
    }
    res.redirect("/teacherSys");  // Redirect to login page after session destruction
  });
});


app.get('/roll-call',async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  
  res.render( 'roll-call.ejs',{
    teacherName: req.session.user.firstname,
    teacherLName: req.session.user.lastname
  });
});

app.get('/view-students', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  try {
      const sectionResult = await pool.query('SELECT * FROM section');
      const prefixResult = await pool.query('SELECT * FROM prefix');
      const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
      const studentResult = await pool.query('SELECT * FROM student');
      
      // Pass curriculums and other data to the EJS template
      res.render('view-students', {
          sections: sectionResult.rows,
          prefixes: prefixResult.rows,
          curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
          students: studentResult.rows,
          teacherName: req.session.user.firstname,
          teacherLName: req.session.user.lastname
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

app.get('/add-section', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  try {
    const sectionResult = await pool.query('SELECT * FROM section');
   
    const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
   
    res.render( 'add-section.ejs',{
      sections: sectionResult.rows,
      curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
      teacherName: req.session.user.firstname,
      teacherLName: req.session.user.lastname
    });

  }catch(err){

  }

});

app.get('/getStudentDetails/:studentId', async (req, res) => {
  const { studentId } = req.params;

  // Check if studentId is a valid integer
  if (!Number.isInteger(parseInt(studentId))) {
    return res.status(400).json({ success: false, message: 'Invalid student ID' });
  }

  try {
    // Query to fetch student details along with the associated curriculum
    const studentQuery = `
      SELECT s.id, s.firstName, s.lastName, s.email, s.telephone, s.sex, TO_CHAR(s.date_birth, 'YYYY-MM-DD') as date_birth, s.curriculum_id, c.curr_name_en 
      FROM student s
      JOIN curriculum c ON s.curriculum_id = c.id
      WHERE s.id = $1
    `;
    const studentResult = await pool.query(studentQuery, [studentId]);

    // Query to get all curriculums
    const curriculumsQuery = 'SELECT id, curr_name_en FROM curriculum ORDER BY id ASC';
    const curriculumsResult = await pool.query(curriculumsQuery);

    // Check if the student exists
    if (studentResult.rows.length > 0) {
      res.json({
        success: true,
        student: studentResult.rows[0], // Student data
        curriculums: curriculumsResult.rows  // List of all curriculums for dropdown
      });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }

  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ success: false, message: 'Error fetching student details' });
  }
});




app.get('/rollCallStd', (req, res) => {
    res.render(path.join(staticPath, 'rollCallStd.ejs'));
});

app.get('/mnUser', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  res.render('manageUser.ejs', { teacherName: req.session.user.firstname });
  
});

app.get('/addStd', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  try {
      const sectionResult = await pool.query('SELECT * FROM section');
      const prefixResult = await pool.query('SELECT * FROM prefix');
      const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
      const studentResult = await pool.query('SELECT * FROM student');
      
      // Pass curriculums and other data to the EJS template
      res.render('addStd', {
          sections: sectionResult.rows,
          prefixes: prefixResult.rows,
          curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
          students: studentResult.rows,
          teacherName: req.session.user.firstname
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});





// POST routes for adding sections, prefixes, curriculums, and students
app.post('/addSection', async (req, res) => {
  const { section } = req.body;
  try {
    const userRole = req.session.user.status;
    await pool.query('INSERT INTO section (section) VALUES ($1)', [section]);
    if (userRole === 'admin') {
      res.redirect('/addStd');
    } else if (userRole === 'teacher') {
      res.redirect('/add-section');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).send('Internal Server Error');
  }
  
});




app.post('/addPrefix', async (req, res) => {
  const { prefix } = req.body;

  try {
      // Check if the prefix already exists
      const result = await pool.query('SELECT * FROM prefix WHERE prefix = $1', [prefix]);
      
      if (result.rows.length > 0) {
        console.log(result.rows , "<<<< Prefix already exists. Please enter a new one.");
          // Prefix already exists, render the page with an error message
          const sections = await pool.query('SELECT * FROM section');
          const prefixes = await pool.query('SELECT * FROM prefix');
          const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
          const studentResult = await pool.query('SELECT * FROM student');
          res.render('addStd', {
              sections: sections.rows,
              prefixes: prefixes.rows,
              curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
              students: studentResult.rows,
              message: "Prefix already exists. Please enter a new one."
              
              
              
          });
      } else {
          // Prefix doesn't exist, insert it into the database
          await pool.query('INSERT INTO prefix (prefix) VALUES ($1)', [prefix]);
          res.redirect('/addStd');
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

app.post('/addCurriculum', async (req, res) => {
  const { curr_name_en, short_name_en } = req.body;
  await pool.query('INSERT INTO curriculum (curr_name_en, short_name_en) VALUES ($1, $2)', [curr_name_en, short_name_en]);
  res.redirect('/addStd');
});

app.post('/addStudent', async (req, res) => {
  const { prefixId } = req.body;
  const { firstName, lastName, email, telephone, sex, curriculumId, date_birth } = req.body;
  const status = "student";
    // Insert prefix and retrieve the generated ID
    const prefixResult = await pool.query(
      'INSERT INTO prefix (prefix) VALUES ($1) RETURNING id',[prefixId]);
    const AddprefixId = prefixResult.rows[0].id;  // Access the ID from the first row

  await pool.query(
      'INSERT INTO student ( firstName, lastName, email, telephone, sex, curriculum_id, date_birth, status,prefix_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [firstName, lastName, email, telephone, sex, curriculumId, date_birth, status,AddprefixId]
  );


  res.redirect('/addStd');
});
////Update routes
app.post('/updateStudent', async (req, res) => {
  const { id, firstname, lastname, email, telephone, sex, date_birth, curriculum_id } = req.body;



  // Logging for debugging
  console.log(req.body); // Log the received data

  try {
    const userRole = req.session.user.status; // Assuming user role is stored in req.session.user.status

    // Perform the update query
    await pool.query(`
      UPDATE student 
      SET firstname = $1, lastname = $2, email = $3, telephone = $4, sex = $5, date_birth = $6, curriculum_id = $7
      WHERE id = $8
    `, [firstname, lastname, email, telephone, sex, date_birth ? date_birth : null, curriculum_id, id]);

    // Redirect based on the user's role
    if (userRole === 'admin') {
      res.redirect('/addStd'); // Redirect admin to /addStd
    } else if (userRole === 'teacher') {
      res.redirect('/view-students'); // Redirect teacher to /view-students
    } else {
      res.redirect('/'); // Optional: redirect to a default page if role is unrecognized
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Error updating student' });
  }
});



// DELETE routes
app.post('/deleteSection', async (req, res) => {
  const { id } = req.body;
  try {
    const userRole = req.session.user.status;
    await pool.query('DELETE FROM section WHERE id = $1', [id]);
    if (userRole === 'admin') {
      res.redirect('/addStd');
    } else if (userRole === 'teacher') {
      res.redirect('/add-section');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/deletePrefix', async (req, res) => {
  const { id } = req.body;
  await pool.query('DELETE FROM prefix WHERE id = $1', [id]);
  res.redirect('/addStd');
});

app.post('/deleteCurriculum', async (req, res) => {
  const { id } = req.body;
  await pool.query('DELETE FROM curriculum WHERE id = $1', [id]);
  res.redirect('/addStd');
});

app.post('/deleteStudent', async (req, res) => {
  const { id } = req.body;
  
  try {
    const prefixResult = await pool.query('SELECT prefix_id FROM student WHERE id = $1', [id]);
    if (prefixResult.rows.length > 0) {
      const prefixId = prefixResult.rows[0].prefix_id;
  
      // Delete the student from the student table
      await pool.query(
        'DELETE FROM student WHERE id = $1', [id]);
  
      // Delete the associated prefix from the prefix table
      await pool.query(
        'DELETE FROM prefix WHERE id = $1', [prefixId]);
    
    res.json({ success: true, message: 'Student deleted successfully!' });
  } else {
    res.status(404).send('Student not found');
  }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error deleting student' });
  }
});






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
