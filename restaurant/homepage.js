
function setLanguage(language) {
    const dropdownToggle = document.getElementById('languageDropdown');
  
    if (language === 'french') {
        dropdownToggle.innerHTML = `
            <img src="./images/FRA_logo.png" alt="French" width="20px" class="me-2"> Français
        `;
        // Additional logic to switch content to French
    } else if (language === 'english') {
        dropdownToggle.innerHTML = `
            <img src="./images/USA_logo.png" alt="English" width="20px" class="me-2"> English
        `;
        // Additional logic to switch content to English
    }
  }
  
  // Set the default language to French on page load
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage('french');
  });

//   const scrollContainer = document.querySelector('.testimonials__grid');
//   let scrollSpeed = 1; // Adjust the scroll speed
  
//   function scrollTestimonials() {
//     scrollContainer.scrollLeft += scrollSpeed;
//     if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.offsetWidth) {
//       scrollContainer.scrollLeft = 0;
//     }
//   }
  
//   setInterval(scrollTestimonials, 20); // Adjust the interval for smoother scrolling

document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector('.testimonials__track');
    const cards = document.querySelectorAll('.card-test');

    cards.forEach((card) => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
});