import Swal from 'sweetalert2'; // Assuming SweetAlert2 is installed



const deleteStudentBtns = document.querySelectorAll('.delete-student-btn');

deleteStudentBtns.forEach(btn => {
  btn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default form behavior

    const studentId = event.currentTarget.parentElement.querySelector('input[name="id"]').value;

    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch('/deleteStudent', {
          method: 'POST',
          body: JSON.stringify({ id: studentId }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Remove the student element from the DOM
            const studentListItem = event.currentTarget.parentElement.parentElement; // Assuming parent structure
            studentListItem.parentNode.removeChild(studentListItem);
            Swal.fire('Deleted!', data.message, 'success');
          } else {
            console.error('Error deleting student:', data.message);
            Swal.fire('Error', data.message, 'error');
          }
        } else {
          console.error('Error sending request:', response.statusText);
          Swal.fire('Error', 'An error occurred during deletion.', 'error');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        Swal.fire('Error', 'An error occurred during deletion.', 'error');
      }
    }
  });
});