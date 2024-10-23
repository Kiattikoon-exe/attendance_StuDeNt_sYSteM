import Swal from "sweetalert2"; // Assuming SweetAlert2 is installed

const deleteStudentBtns = document.querySelectorAll(".delete-student-btn");

deleteStudentBtns.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form behavior

    const studentId =
      event.currentTarget.parentElement.querySelector('input[name="id"]').value;

    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch("/deleteStudent", {
          method: "POST",
          body: JSON.stringify({ id: studentId }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Remove the student element from the DOM
            const studentListItem =
              event.currentTarget.parentElement.parentElement; // Assuming parent structure
            studentListItem.parentNode.removeChild(studentListItem);
            Swal.fire("Deleted!", data.message, "success");
          } else {
            console.error("Error deleting student:", data.message);
            Swal.fire("Error", data.message, "error");
          }
        } else {
          console.error("Error sending request:", response.statusText);
          Swal.fire("Error", "An error occurred during deletion.", "error");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        Swal.fire("Error", "An error occurred during deletion.", "error");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Set default date and time to the current date and time
  const now = new Date();
  document.getElementById("attendance-date").valueAsDate = now;
  document.getElementById("attendance-time").value = now
    .toTimeString()
    .slice(0, 5);

  // Handle radio button uncheck (for attendance status radio buttons)
  document.querySelectorAll(".btn-check").forEach((radio) => {
    radio.addEventListener("click", function (e) {
      if (this.classList.contains("active")) {
        setTimeout(() => {
          this.checked = false;
          this.classList.remove("active");
        }, 0);
      }
    });
  });

  // Modify the section change handler
  document
    .getElementById("section-select")
    .addEventListener("change", function () {
      const selectedSectionId = this.value;
      fetch(`/searchStudents?type=section&term=${selectedSectionId}`)
        .then((response) => response.json())
        .then((data) => {
          const tableBody = document.getElementById("student-data");
          tableBody.innerHTML = ""; // Clear previous results

          // Get unique students
          const uniqueStudents = getUniqueStudents(data);

          if (uniqueStudents.length === 0) {
            tableBody.innerHTML =
              '<tr><td colspan="9" class="text-center">No students found</td></tr>';
          } else {
            uniqueStudents.forEach((student) => {
              tableBody.innerHTML += `
                <tr>
                    <td><input type="checkbox" class="student-checkbox" data-student-id="${
                      student.id
                    }"></td>
                    <td>${student.section || "N/A"}</td>
                    <td>${student.prefix}</td>
                    <td>${student.firstname} ${student.lastname}</td>
                    <td>${student.curriculum}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="present_${
                student.id
              }" value="เข้าเรียน" autocomplete="off">
                            <label class="btn btn-outline-success" for="present_${
                              student.id
                            }">เข้าเรียน</label>
                            
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="late_${
                student.id
              }" value="สาย" autocomplete="off">
                            <label class="btn btn-outline-warning" for="late_${
                              student.id
                            }">สาย</label>
                            
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="leave_${
                student.id
              }" value="ลา" autocomplete="off">
                            <label class="btn btn-outline-info" for="leave_${
                              student.id
                            }">ลา</label>

                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="absent_${
                student.id
              }" value="ขาด" autocomplete="off">
                            <label class="btn btn-outline-danger" for="absent_${
                              student.id
                            }">ขาด</label>
                        </div>
                    </td>
                </tr>
            `;
            });
          }

          // Re-bind event listeners
          bindUpdateEventListeners();
          bindDeleteEventListeners();
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    });

  // Modify the search handler similarly
  document
    .getElementById("search-button")
    .addEventListener("click", function () {
      const searchTerm = document.getElementById("student-search").value;
      const searchType = document.getElementById("search-type").value;

      fetch(`/searchStudents?term=${searchTerm}&type=${searchType}`)
        .then((response) => response.json())
        .then((data) => {
          const tableBody = document.getElementById("student-data");
          tableBody.innerHTML = "";

          // Get unique students
          const uniqueStudents = getUniqueStudents(data);

          if (uniqueStudents.length === 0) {
            tableBody.innerHTML =
              '<tr><td colspan="9" class="text-center">No students found</td></tr>';
          } else {
            uniqueStudents.forEach((student) => {
              // Same table row HTML as above
              tableBody.innerHTML += `
                <tr>
                    <td><input type="checkbox" class="student-checkbox" data-student-id="${
                      student.id
                    }"></td>
                    <td>${student.section || "N/A"}</td>
                    <td>${student.prefix}</td>
                    <td>${student.firstname} ${student.lastname}</td>
                    <td>${student.curriculum}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="present_${
                student.id
              }" value="เข้าเรียน" autocomplete="off">
                            <label class="btn btn-outline-success" for="present_${
                              student.id
                            }">เข้าเรียน</label>
                            
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="late_${
                student.id
              }" value="สาย" autocomplete="off">
                            <label class="btn btn-outline-warning" for="late_${
                              student.id
                            }">สาย</label>
                            
                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="leave_${
                student.id
              }" value="ลา" autocomplete="off">
                            <label class="btn btn-outline-info" for="leave_${
                              student.id
                            }">ลา</label>

                            <input type="radio" class="btn-check" name="status_${
                              student.id
                            }" id="absent_${
                student.id
              }" value="ขาด" autocomplete="off">
                            <label class="btn btn-outline-danger" for="absent_${
                              student.id
                            }">ขาด</label>
                        </div>
                    </td>
                </tr>
            `;
            });
          }

          // Re-bind event listeners
          bindUpdateEventListeners();
          bindDeleteEventListeners();
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    });

  // Function to bind update buttons after search results are updated
  function bindUpdateEventListeners() {
    document.querySelectorAll(".update-student-btn").forEach((button) => {
      button.addEventListener("click", async function (event) {
        // Handle update logic here (omitted for brevity)
      });
    });
  }

  // Function to bind delete buttons after search results are updated
  function bindDeleteEventListeners() {
    document.querySelectorAll(".delete-student-btn").forEach((button) => {
      button.addEventListener("click", async function (event) {
        // Handle delete logic here (omitted for brevity)
      });
    });
  }
  bindUpdateEventListeners();
  bindDeleteEventListeners();

  // Update the save attendance click handler
  document
    .getElementById("add-rollcall-btn")
    .addEventListener("click", async function () {
      const attendanceDate = document.getElementById("attendance-date").value;
      const attendanceTime = document.getElementById("attendance-time").value;

      if (!attendanceDate || !attendanceTime) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: "กรุณากรอกวันที่และเวลา",
          icon: "warning",
        });
        return;
      }

      // Collect attendance data with section information
      const attendanceData = [];
      document
        .querySelectorAll(".student-checkbox:checked")
        .forEach((checkbox) => {
          const row = checkbox.closest("tr");
          const studentId = checkbox.getAttribute("data-student-id");
          const section = row
            .querySelector("td:nth-child(2)")
            .textContent.trim(); // Get section from the row
          const statusRadios = document.querySelectorAll(
            `input[name="status_${studentId}"]`
          );
          const selectedStatus = Array.from(statusRadios).find(
            (radio) => radio.checked
          )?.value;

          if (selectedStatus) {
            attendanceData.push({
              studentId: parseInt(studentId),
              section: section,
              status: selectedStatus,
            });
          }
        });

      if (attendanceData.length === 0) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: "กรุณาเลือกนักศึกษาและระบุสถานะอย่างน้อย 1 คน",
          icon: "warning",
        });
        return;
      }

      try {
        const response = await fetch("/saveAttendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendanceDate,
            attendanceTime,
            attendanceData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: "สำเร็จ",
            text: "บันทึกการเช็คชื่อเรียบร้อยแล้ว",
            icon: "success",
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(data.message || "Failed to save attendance");
        }
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: error.message,
          icon: "error",
        });
      }
    });

  // Add select all functionality
  document.getElementById("select-all").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".student-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
});
// Add this function to remove duplicates while preserving attendance history
function getUniqueStudents(students) {
  const uniqueStudents = new Map();

  students.forEach((student) => {
    // Use student ID as the key to prevent duplicates
    if (!uniqueStudents.has(student.id)) {
      uniqueStudents.set(student.id, student);
    }
  });

  return Array.from(uniqueStudents.values());
}
