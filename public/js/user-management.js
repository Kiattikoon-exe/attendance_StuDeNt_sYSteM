
const userList = document.getElementById("user-list");
const userForm = document.getElementById("user-form");

// Fetch users and display
async function fetchUsers() {
  const response = await fetch("/users");
  const users = await response.json();
  userList.innerHTML = ""; // Clear the user list before populating

  // Use EJS templating to generate table rows
  const userRows = users.map((user) => {
    return `
      <tr>
        <td>${user.firstname} ${user.lastname}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td><button class="btn btn-warning" onclick="updateUser(${user.id}, '${user.firstname}','${user.lastname}','${user.email}','${user.pwd}')">Update</button></td>
        <td><button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button></td>
        </tr>
    `;
  }).join("");

  userList.innerHTML = userRows;
}

// Handle form submission
userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const status = "teacher";

  await fetch("/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, pwd, status }),
  });
   // Handle successful addition (clear form, display success message)
   userForm.reset();
//    alert("User added successfully!");
 
   // Refresh user list after adding a new user
   fetchUsers();
});


 // Update user
 async function updateUser(id, firstname, lastname, email, pwd) {
    const newName = prompt("Enter new firstname:", firstname);
    const newLName = prompt("Enter new lastname:", lastname);
    const newEmail = prompt("Enter new email:", email);
    const newpass = prompt("Enter new password:", pwd);
    if (newName && newLName && newEmail && newpass) {
        await fetch(`/users/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname: newName, lastname: newLName, email: newEmail, pwd: newpass }),
        });
        fetchUsers();
    }
}

// Delete user
async function deleteUser(id) {
    if (confirm("Are you sure to delete this user?")) {
        await fetch(`/users/delete/${id}`, {
            method: "DELETE",
        });
        fetchUsers();
    }
}




fetchUsers(); // Call fetchUsers on page load