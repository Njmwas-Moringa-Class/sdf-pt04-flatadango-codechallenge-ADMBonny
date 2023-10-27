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
  const buyTicketButton = document.getElementById('buy-ticket');

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
    updateBuyTicketButtonState();
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

  function buyTicket() {
    const availableTicketsCount = parseInt(availableTickets.textContent);

    if (availableTicketsCount > 0) {
      availableTickets.textContent = availableTicketsCount - 1;
      updateBuyTicketButtonState();
    } else {
      alert('Sorry, this showing is sold out.');
    }
  }

  function updateBuyTicketButtonState() {
    const availableTicketsCount = parseInt(availableTickets.textContent);
    const currentMovieId = filmsList.querySelector('.selected').dataset.id;
    const otherMovies = Array.from(filmsList.querySelectorAll('.film.item')).filter(item => item.dataset.id !== currentMovieId);

    if (availableTicketsCount === 0) {
      buyTicketButton.textContent = 'Sold Out';
      otherMovies.forEach(item => {
        const tickets = parseInt(item.dataset.tickets);
        if (tickets <= 0) {
          item.classList.add('sold-out');
        }
      });
    } else {
      buyTicketButton.textContent = 'Buy Ticket';
      otherMovies.forEach(item => {
        const tickets = parseInt(item.dataset.tickets);
        if (tickets <= 0) {
          item.classList.add('sold-out');
        } else {
          item.classList.remove('sold-out');
        }
      });
    }
  }

  function createMovieListItem(movie) {
    const listItem = document.createElement('li');
    listItem.classList.add('film', 'item');
    listItem.textContent = movie.title;
    listItem.dataset.id = movie.id;
    listItem.dataset.tickets = movie.capacity - movie.tickets_sold;
    listItem.addEventListener('click', () => {
      loadMovieDetails(movie.id);
      const selected = filmsList.querySelector('.selected');
      if (selected) {
        selected.classList.remove('selected');
      }
      listItem.classList.add('selected');
    });
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

        loadFirstMovieDetails();
      })
      .catch((error) => handleNetworkError(error));
  }

  buyTicketButton.addEventListener('click', buyTicket);
  loadAllMoviesMenu();
});
