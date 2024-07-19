const displayMessage = (message, type = "success") => {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = type;
  setTimeout(() => {
    messageElement.textContent = "";
    messageElement.className = "";
  }, 3000);
};

const onSubmit = (event) => {
  event.preventDefault();
  const eventName = document.getElementById("eventName").value;
  const eventDate = document.getElementById("eventDate").value;

  if (!eventName || !eventDate) {
    alert("Please enter both event name and date.");
    return;
  }

  const today = new Date();
  const inputDate = new Date(eventDate);
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
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
          <img src="./asset/edit.png" alt="Edit">
        </button>
        <button class="delete-btn" data-index="${index}">
          <img src="./asset/delete.png" alt="Delete">
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

const deleteEvent = (index) => {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  updateEventList();
  displayMessage("Successfully deleted event", "error");
};

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

document.addEventListener("DOMContentLoaded", () => {
  updateEventList();
  document.getElementById("setReminder").addEventListener("click", onSubmit);
});
