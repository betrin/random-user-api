// Generic Variables
const gallery = document.getElementById('gallery');
const url = "https://randomuser.me/api/?results=12";
let users = [];
var currIndex = 0;

// Modal Variables
const modal = document.querySelector('.modal-container');
const closeButton = document.getElementById('modal-close-btn');
const modalContent = document.querySelector('.modal-info-container');
const modalBtnContainer = document.querySelector('.modal-btn-container');
const prevBtn = document.getElementById('modal-prev');
const nextBtn = document.getElementById('modal-next');
var modalOpen = false;
const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
}

//Search Func Variables
const searchInput = document.querySelector("#search-input");
const filterSubmit = document.getElementById('search-submit');
var filteredUsers = [];

// Get Data 
async function getData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const json = await res.json();
    users = json.results; 
    return Promise.resolve(users);
  } catch (error) {
  }
}

// Add all of the cards
function getCards(data) {
  gallery.innerHTML = '';
  var html = '';
  data.forEach((user, index) => {
    html += `
      <div class="card" data-user-index="${index}">
        <div class="card-img-container">
          <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
      </div>
    `
  })

  gallery.insertAdjacentHTML('beforeend', html);
}


// Get the date in desired format
function formatDate(userDob) {
  const date = new Date(userDob);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}


// Pop up fucntionality 
function displayUserModal(index) {
  const dataSource = filteredUsers.length > 0 ? filteredUsers : users; // Use filteredUsers if active
  const user = dataSource[index];

  let userDob = user.dob.date;

  const modalHtml = `
    <div class="modal-info-container">
        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${user.name.first}</h3>
        <p class="modal-text">${user.email}</p>
        <p class="modal-text cap">${user.location.city}, ${user.location.state}</p>
        <hr>
        <p class="modal-text">${user.phone}</p>
        <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state}, OR ${user.location.postcode}</p>
        <p class="modal-text">Birthday: ${formatDate(userDob)}</p>
    </div>
  `
  modalContent.innerHTML = modalHtml;
  
  if(!modalOpen) {
    modal.style.display = "block";
    modalOpen = true;
  }
}

// Event Listerners
gallery.addEventListener('click', (e) => {
  const userCard = event.target.closest('.card');
  if (!userCard) return;

  const userIndex = userCard.dataset.userIndex;
  currIndex = userIndex;
  displayUserModal(currIndex);
}) 

// Close BTN CLICK Event 
closeButton.addEventListener('click', () => {
  modal.style.display = "none";
  modalOpen = false;
});


// PREV NEXT BTN CLICK Events 
prevBtn.addEventListener('click', () => {
  const dataSource = filteredUsers.length > 0 ? filteredUsers : users;
  if (currIndex > 0) {
    currIndex--;
    displayUserModal(currIndex);
  }
});

nextBtn.addEventListener('click', () => {
  const dataSource = filteredUsers.length > 0 ? filteredUsers : users;
  if (currIndex < dataSource.length - 1) {
    currIndex++;
    displayUserModal(currIndex);
  }
});

// When you click outside pop up it closes
modal.addEventListener('click', (e) => {
  const isOutside = !e.target.closest('.modal') && !e.target.closest('.modal-btn-container');
  if(isOutside) {
    modal.style.display = "none";
    modalOpen = false;
  }
})

// ESCAPE key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = "none";
    modalOpen = false;
  }
})


// Filter Func
function filterUsers() {
  filteredUsers = [];
  const userInput = searchInput.value.toLowerCase();
  // Find users that match
  for (let i = 0; i < users.length; i++) {
    const currentUser = (users[i].name.first + ' ' + users[i].name.last).toLowerCase();
    if (currentUser.includes(userInput)){
      filteredUsers.push(users[i]);
    }
  }

  if (filteredUsers.length > 0) {
    getCards(filteredUsers); 
  } else {
    const html = "<h3>No results were found</h3>";
    gallery.innerHTML = html;
  }
}

// Button event although not really needed but added just in case 
filterSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  filterUsers();
});

// Event Listenrer for the typign
searchInput.addEventListener('keyup', () => {
  filterUsers();
});

// Initial run 
getData(url)
  .then(data => getCards(data));
