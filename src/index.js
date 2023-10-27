// Your code here
document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'http://localhost:3000';
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const showtime = document.getElementById('showtime');
  const availableTickets = document.getElementById('ticket-num');
  const description = document.getElementById('film-info');
  const filmsList = document.getElementById('films');

  function handleNetworkError(error) {
    console.error('Network error:', error);
    alert('There was a network error. Please try again later.');
  }

  function updateMovieDetails(movie) {
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = `${movie.runtime} minutes`;
    showtime.textContent = movie.showtime;
    availableTickets.textContent = movie.capacity - movie.tickets_sold;
    description.textContent = movie.description;
  }

  function loadFirstMovieDetails() {
    fetch(`${baseURL}/films/1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((movie) => {
        updateMovieDetails(movie);
      })
      .catch((error) => handleNetworkError(error));
  }

  function loadMovieDetails(movieId) {
    fetch(`${baseURL}/films/${movieId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((movie) => {
        updateMovieDetails(movie);
      })
      .catch((error) => handleNetworkError(error));
  }

  // Function to handle buying a ticket
  function buyTicket() {
    const availableTicketsCount = parseInt(availableTickets.textContent);
    
    // Check if there are available tickets
    if (availableTicketsCount > 0) {
      // Decrease the number of available tickets by 1
      availableTickets.textContent = availableTicketsCount - 1;
    } else {
      alert('Sorry, this showing is sold out.');
    }
  }

  function createMovieListItem(movie) {
    const listItem = document.createElement('li');
    listItem.classList.add('film', 'item');
    listItem.textContent = movie.title;
    listItem.addEventListener('click', () => loadMovieDetails(movie.id));
    return listItem;
  }

  function loadAllMoviesMenu() {
    fetch(`${baseURL}/films`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((movies) => {
        movies.forEach((movie) => {
          const listItem = createMovieListItem(movie);
          filmsList.appendChild(listItem);
        });

        // Load and display the details of the first movie in the list
        loadFirstMovieDetails();
      })
      .catch((error) => handleNetworkError(error));
  }

  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', buyTicket);

  loadAllMoviesMenu();
});
