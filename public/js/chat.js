const messageForm = document.querySelector("#message-form");
const locationBtn = document.querySelector("#location-button");

const socket = io();

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});

locationBtn.addEventListener("click", (e) => {
  e.preventDefault();

  navigator.geolocation.getCurrentPosition((position) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("sendLocation", coords);
  });
});

socket.on("message", (message) => {
  console.log(message);
});
