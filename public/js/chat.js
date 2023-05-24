const messageForm = document.querySelector("#message-form");

const socket = io();

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});

socket.on("message", (message) => {
  console.log(message);
});
