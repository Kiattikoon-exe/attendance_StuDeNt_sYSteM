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
    const sectionResult = await pool.query('SELECT * FROM section');
    const prefixResult = await pool.query('SELECT * FROM prefix');
    const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
    const studentResult = await pool.query('SELECT * FROM student');
    const studentListResult = await pool.query('SELECT * FROM student_list');
  
  res.render( 'roll-call.ejs',{
      sections: sectionResult.rows,
      prefixes: prefixResult.rows,
      curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
      students: studentResult.rows,
      studentList: studentListResult.rows,
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

app.get('/student-management', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirect to login if not logged in
  }
  try {
    const sectionResult = await pool.query('SELECT * FROM section');
    const prefixResult = await pool.query('SELECT * FROM prefix');
    const curriculumResult = await pool.query('SELECT * FROM curriculum');  // Query for curriculums
    const studentResult = await pool.query('SELECT * FROM student');
    const studentListResult = await pool.query('SELECT * FROM student_list');
   
    res.render( 'student-management.ejs',{
      sections: sectionResult.rows,
      prefixes: prefixResult.rows,
      curriculums: curriculumResult.rows,  // Ensure curriculums are passed here
      students: studentResult.rows,
      studentList: studentListResult.rows,
      teacherName: req.session.user.firstname,
      teacherLName: req.session.user.lastname
    });

  }catch(err){

  }

});



// app.get('/searchStudents', async (req, res) => {
//   const { term, type } = req.query;
  
//   let query = `
//     SELECT student.id, student.firstname, student.lastname, student.email, student.telephone, student.sex, 
//            student.date_birth, curriculum.curr_name_en as curriculum, prefix.prefix 
//     FROM student 
//     INNER JOIN curriculum ON student.curriculum_id = curriculum.id 
//     INNER JOIN prefix ON student.prefix_id = prefix.id
//   `;
  
//   const values = [];

//   if (type === 'id') {
//     // Partial match on the ID (prefix)
//     query += ' WHERE prefix.prefix ILIKE $1';
//     values.push(`%${term}%`);
//   } else if (type === 'name') {
//     // Partial match on the first or last name
//     query += ' WHERE student.firstname ILIKE $1 OR student.lastname ILIKE $1';
//     values.push(`%${term}%`);
//   } else if (type === 'curriculum') {
//     // Partial match on the curriculum name
//     query += ' WHERE curriculum.curr_name_en ILIKE $1';
//     values.push(`%${term}%`);
//   } else {
//     // If no specific type, search in all fields
//     query += ` WHERE prefix.prefix ILIKE $1 OR student.firstname ILIKE $1 
//                OR student.lastname ILIKE $1 OR curriculum.curr_name_en ILIKE $1`;
//     values.push(`%${term}%`);
//   }

//   try {
//     const result = await pool.query(query, values);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
app.get('/searchStudents', async (req, res) => {
  const { term, type } = req.query;
  
  let query = `
    SELECT student.id, student.firstname, student.lastname, student.email, student.telephone, student.sex, 
           student.date_birth, curriculum.curr_name_en AS curriculum, prefix.prefix, section.section
    FROM student 
    INNER JOIN curriculum ON student.curriculum_id = curriculum.id 
    INNER JOIN prefix ON student.prefix_id = prefix.id
    LEFT JOIN student_list ON student.id = student_list.student_id
    LEFT JOIN section ON student_list.section_id = section.id
  `;
  
  const values = [];

  if (type === 'id') {
    // Partial match on the ID (prefix)
    query += ' WHERE prefix.prefix ILIKE $1';
    values.push(`%${term}%`);
  } else if (type === 'name') {
    // Partial match on the first or last name
    query += ' WHERE student.firstname ILIKE $1 OR student.lastname ILIKE $1';
    values.push(`%${term}%`);
  } else if (type === 'curriculum') {
    // Partial match on the curriculum name
    query += ' WHERE curriculum.curr_name_en ILIKE $1';
    values.push(`%${term}%`);
  } else if (type === 'section') {
    // Partial match on the section number
    query += ' WHERE section.section::TEXT ILIKE $1';
    values.push(`%${term}%`);
  } else {
    // If no specific type, search in all fields
    query += ` WHERE prefix.prefix ILIKE $1 OR student.firstname ILIKE $1 
               OR student.lastname ILIKE $1 OR curriculum.curr_name_en ILIKE $1
               OR section.section::TEXT ILIKE $1`;
    values.push(`%${term}%`);
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
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
      res.redirect('/student-management');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).send('Internal Server Error');
  }
  
});

// API endpoint to add students to a section
app.post('/addStudentsToSection', async (req, res) => {
  const { sectionId, studentIds } = req.body;
  const client = await pool.connect();

  try {
      await client.query('BEGIN');

      // Validate input
      if (!sectionId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
          throw new Error('Invalid input parameters');
      }

      // Check if section exists
      const sectionCheck = await client.query(
          'SELECT id FROM section WHERE id = $1',
          [sectionId]
      );

      if (sectionCheck.rows.length === 0) {
          throw new Error('Section not found');
      }

      // Remove any existing section assignments for these students
      await client.query(
          `DELETE FROM student_list 
           WHERE student_id = ANY($1::int[])`,
          [studentIds]
      );

    // Get current timestamp in Thailand timezone (UTC+7)
    const now = new Date();
    // Add 7 hours to UTC time to get Thailand time
    const thailandTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    // Format the date to match your database format
    const formattedDate = thailandTime.toISOString().replace('T', ' ').slice(0, 19);
    
     // Insert new section assignments with formatted timestamp
     // insert into ,tatus,datecheck,timecheck  values ,$3,$4,CURRENT_TIMESTAMP(0) AT TIME ZONE 'Asia/Bangkok' values , 'active', formattedDate
     const insertValues = studentIds.map(studentId => ({
      text: `INSERT INTO student_list (section_id, student_id) 
             VALUES ($1, $2)`,
      values: [sectionId, studentId]
  }));
        // Execute all insert queries
        for (const query of insertValues) {
          await client.query(query.text, query.values);
      }

      await client.query('COMMIT');

      res.json({
          success: true,
          message: 'Students successfully added to section'
      });

  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in addStudentsToSection:', error);
      res.status(500).json({
          success: false,
          message: error.message || 'An error occurred while adding students to section'
      });
  } finally {
      client.release();
  }
});

app.post('/saveAttendance', async (req, res) => {
  const { sectionId, attendanceDate, attendanceTime, attendanceData } = req.body;
  const client = await pool.connect();

  try {
      await client.query('BEGIN');

      // Validate input
      if (!sectionId || !attendanceDate || !attendanceTime || !Array.isArray(attendanceData)) {
          throw new Error('Invalid input parameters');
      }

      // Check if section exists
      const sectionCheck = await client.query(
          'SELECT id FROM section WHERE id = $1',
          [sectionId]
      );

      if (sectionCheck.rows.length === 0) {
          throw new Error('Section not found');
      }

      // Combine date and time
      const dateTime = `${attendanceDate} ${attendanceTime}`;

      // Insert attendance records
      for (const attendance of attendanceData) {
          await client.query(
              `UPDATE student_list 
               SET status = $1, 
                   datecheck = $2,
                   timecheck = $3
               WHERE section_id = $4 
               AND student_id = $5`,
              [
                  attendance.status,
                  attendanceDate,
                  attendanceTime,
                  sectionId,
                  attendance.studentId
              ]
          );
      }

      await client.query('COMMIT');

      res.json({
          success: true,
          message: 'Attendance successfully recorded'
      });

  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in saveAttendance:', error);
      res.status(500).json({
          success: false,
          message: error.message || 'An error occurred while saving attendance'
      });
  } finally {
      client.release();
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
      res.redirect('/student-management');
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
