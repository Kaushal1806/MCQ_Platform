// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.mcq-item button').forEach((button) => {
//       button.addEventListener('click', (e) => {
//         const correctAnswer = e.target.parentElement.dataset.correct;
//         if (e.target.textContent === correctAnswer) {
//           e.target.classList.add('correct');
//         } else {
//           e.target.classList.add('incorrect');
//         }
//       });
//     });
  
//     const searchBar = document.getElementById('search-bar');
//     searchBar.addEventListener('input', () => {
//       const tag = searchBar.value.trim();
//       window.location.href = `/?tag=${tag}`;
//     });
//   });

// document.addEventListener('DOMContentLoaded', function () {
//     const mcqItems = document.querySelectorAll('.mcq-item');

//     mcqItems.forEach(item => {
//         const buttons = item.querySelectorAll('button');
//         const correctAnswer = item.getAttribute('data-correct');

//         buttons.forEach(button => {
//             button.addEventListener('click', function () {
//                 if (button.innerText === correctAnswer) {
//                     button.style.backgroundColor = 'green';
//                 } else {
//                     button.style.backgroundColor = 'red';
//                 }
//             });
//         });
//     });
// });
  



// document.addEventListener('DOMContentLoaded', () => {
//   // Handle button clicks for correct/incorrect answers
//   document.querySelectorAll('.mcq-item button').forEach((button) => {
//       button.addEventListener('click', (e) => {
//           const correctAnswer = e.target.parentElement.dataset.correct;
//           if (e.target.textContent === correctAnswer) {
//               e.target.classList.add('correct');
//               e.target.style.backgroundColor = 'green';
//           } else {
//               e.target.classList.add('incorrect');
//               e.target.style.backgroundColor = 'red';
//           }
//       });
//   });

//   // Handle search input
//   const searchBar = document.getElementById('search-bar');
//   searchBar.addEventListener('input', () => {
//       const tag = searchBar.value.trim();
//       window.location.href = `/?tag=${encodeURIComponent(tag)}`;
//   });
// });




document.addEventListener('DOMContentLoaded', () => {
  // Toggle Dark/Light Mode
  const toggleButton = document.getElementById('mode-toggle');
  console.log('Toggle button:', toggleButton); 
  
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }
  else {
    console.log('Toggle button not found');
}

  // Handle MCQ Option Click
  document.querySelectorAll('.mcq-item button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const correctAnswer = e.target.parentElement.dataset.correct;
      if (e.target.textContent === correctAnswer) {
        e.target.classList.add('correct');
      } else {
        e.target.classList.add('incorrect');
      }
    });
  });

  // Search Functionality
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('input', () => {
    const tag = searchBar.value.trim();
    window.location.href = `/?tag=${tag}`;
  });

   // Show success message
   const urlParams = new URLSearchParams(window.location.search);
   if (urlParams.get('added') === 'true') 
    {
     const successMessage = document.getElementById('success-message');
     successMessage.style.display = 'block';
     setTimeout(() => {
       successMessage.style.display = 'none';
     }, 3000);
    }
 });



