
# Event Reminder Website

This project is an event reminder website developed by Yuben Bauty and Gagah Pradana. The website allows users to add, view, update, and delete upcoming events, ensuring they never miss an important occasion.

## Features

- Add Event: Users can add new events with details such as the event name and date.
- View Events: A list of upcoming events is displayed in a scrollable section.
- Edit Event: Users can edit the details of existing events.
- Delete Event: Users can delete events from the list.
- Success Message: A success message is displayed under the upcoming events section after adding, - editing, or deleting an event.


## Project Structure

```bash
/root
|-- index.html
|-- /script
|   |-- script.js
| --|/style
| --|-- style.css
```
- index.html: The main HTML file for the website.
- /script/script.js: Contains the JavaScript code to handle fetching, displaying, and manipulating event data.
- /style/style.css: Contains the CSS code to design the ui


## Javascript Functionality

### displayMessage
This function displays a temporary message to the user.

```javascript
const displayMessage = (message, type = "success") => {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = type;
  setTimeout(() => {
    messageElement.textContent = "";
    messageElement.className = "";
  }, 3000);
};

```

### onSubmit
This function handles the form submission for adding a new event.

```javascript
const onSubmit = (event) => {
  event.preventDefault();
  const eventName = document.getElementById("eventName").value;
  const eventDate = document.getElementById("eventDate").value;

  if (!eventName || !eventDate) {
    alert("Please enter both event name and date.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of the day

  const inputDate = new Date(eventDate);
  inputDate.setHours(0, 0, 0, 0); // Set to the start of the day

  if (inputDate < today) {
    alert("Cannot set event on the past.");
    return;
  }

  const [year, month, day] = eventDate.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.push({ name: eventName, date: formattedDate });
  localStorage.setItem("events", JSON.stringify(events));

  document.getElementById("eventName").value = "";
  document.getElementById("eventDate").value = "";

  updateEventList();
  displayMessage("Successfully added event");
};
}
```

### updateEventList
This function updates the list of events displayed to the user.

```javascript
const updateEventList = () => {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const upcomingEventsDiv = document.querySelector(".upcoming-events");
  const noEventsMessageDiv = document.querySelector(".no-events-message");

  upcomingEventsDiv.innerHTML = "";
  noEventsMessageDiv.textContent = "";

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("en-GB").split("/").join("-");

  const todayEvents = events.filter((event) => event.date === todayFormatted);

  const eventTitleElement = document.querySelector(".event-details h2");
  if (todayEvents.length > 0) {
    eventTitleElement.textContent = `${todayEvents[0].name} 🥳`;
  } else {
    eventTitleElement.textContent = "No Events Today";
  }

  events.sort((a, b) => {
    const dateA = new Date(a.date.split("-").reverse().join("-"));
    const dateB = new Date(b.date.split("-").reverse().join("-"));
    return dateA - dateB;
  });

  if (events.length === 0) {
    noEventsMessageDiv.textContent = "No Events";
    noEventsMessageDiv.style.color = "red";
  }

  events.forEach((event, index) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event-item");
    eventElement.innerHTML = `
      <div class="event-content">
        <span class="event-name">${event.name}</span>
        <span class="event-date">${event.date}</span>
        <button class="edit-btn" data-index="${index}">
          <img src="../asset/edit.png" alt="Edit">
        </button>
        <button class="delete-btn" data-index="${index}">
          <img src="../asset/delete.png" alt="Delete">
        </button>
      </div>
    `;
    upcomingEventsDiv.appendChild(eventElement);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.closest("button").getAttribute("data-index");
      editEvent(index);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.closest("button").getAttribute("data-index");
      deleteEvent(index);
    });
  });
};
```

### deleteEvent
This function deletes an event from the list.

```javascript
const deleteEvent = (index) => {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  updateEventList();
  displayMessage("Successfully deleted event", "error");
};
```

### editEvent
This function edits an existing event.

```javascript
const editEvent = (index) => {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  const newName = prompt("Enter new event name:", events[index].name);
  const newDate = prompt(
    "Enter new event date (YYYY-MM-DD):",
    events[index].date
  );

  if (newName && newDate) {
    const today = new Date();
    const inputDate = new Date(newDate);

    if (inputDate < today) {
      alert("Cannot set event on the past.");
      return;
    }

    events[index].name = newName;
    events[index].date = newDate;
    localStorage.setItem("events", JSON.stringify(events));
    updateEventList();
    displayMessage("Successfully updated event");
  } else {
    alert("Both fields are required to edit the event.");
  }
};
```




## Getting Started

### Prerequisites
- Live Server extension for Visual Studio Code (or any other method to serve the files locally).

### Installation

- Clone the repository:

```bash
  git clone https://github.com/yourusername/event-reminder-website.git
```

- Open the project folder in your code editor.

    
## Usage

- Open index.html with Live Server or any other local server setup.
- The website will display a list of upcoming events fetched from local storage.
- Use the input fields and buttons to add, edit, or delete events.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.



## Authors

- Yuben Bauty
- Gagah Pradana
