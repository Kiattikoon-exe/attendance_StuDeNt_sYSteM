// routes/users.js
import pool from "../db.js";
import express from "express";
import session from "express-session";
// import { redirect } from "express/lib/response.js";
// import { status } from "express/lib/response.js";
// Session middleware configuration
const router = express.Router();

router.use(
  session({
   
    secret: 'kiatikoon',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);
// const express = require("express");



// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teacher");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// INSERT a new user
router.post("/add", async (req, res) => {
  const { firstname,lastname, email,pwd,status  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO teacher (firstname,lastname, email,pwd,status) VALUES ($1, $2,$3,$4,$5) RETURNING *",
      [firstname,lastname, email,pwd,status ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// UPDATE a user
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { firstname,lastname, email,pwd } = req.body;
  try {
    const result = await pool.query(
      "UPDATE teacher SET firstname = $1,lastname = $2, email = $3,pwd = $4 WHERE id = $5 RETURNING *",
      [firstname,lastname, email,pwd, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// DELETE a user
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM teacher WHERE id = $1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// DELETE a student
// router.delete("/deleteStd/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query("DELETE FROM student WHERE id = $1", [id]);
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  

  try {
    // Query to check user in the database
    const result = await pool.query('SELECT * FROM teacher WHERE email = $1 ', [email]);
    
    console.log(result.rows);  // To see what data is returned from the database

    if (result.rows.length > 0 ) {
      const user = result.rows[0];

      // Assuming you're using plain text passwords (which is not secure),
      // you'll want to compare the plain password to the stored one.
      // You should use bcrypt if storing hashed passwords.
      if (password === user.pwd) {
        const status = user.status;
        // Login successful, return success and session data
        //{ข้างหน้า = variable ข้างหลัง database}
        req.session.user = { id: user.id, email: user.email, password: user.pwd ,firstname: user.firstname, lastname: user.lastname, status : status};
        if (status === 'teacher') {
            console.log(status);
            return res.status(200).json({
            success: true,
            message: 'Login successful',
            redirectTo: '/teacherHome',
          });
        } else if(status === 'admin'){
            console.log(status);
            return res.status(200).json({
            success: true,
            message: 'Login successful',
            redirectTo: '/homepage',
          });
        }
        
      
      } else {
        // Password mismatch
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    } else {
      // User not found
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

  } catch (error) {
    // Handle server error
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});




export default router;
// module.exports = usersRouter;
