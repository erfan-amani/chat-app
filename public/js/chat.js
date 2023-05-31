const $messageForm = document.querySelector("#message-form");
const $messageBtn = $messageForm.querySelector("button");
const $messageInput = $messageForm.querySelector("#message");
const $locationBtn = document.querySelector("#location-button");
const $messagesContainer = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;

const socket = io();

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageBtn.setAttribute("disabled", true);

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    $messageBtn.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered.");
  });
});

$locationBtn.addEventListener("click", (e) => {
  e.preventDefault();

  $locationBtn.setAttribute("disabled", true);

  navigator.geolocation.getCurrentPosition((position) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("sendLocation", coords, (error) => {
      $locationBtn.removeAttribute("disabled");

      if (error) {
        return console.log(error);
      }

      console.log("Location shared!");
    });
  });
});

socket.on("message", (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplate, { message });
  $messagesContainer.insertAdjacentHTML("beforeend", html);
});
