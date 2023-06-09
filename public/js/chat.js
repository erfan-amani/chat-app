const $messageForm = document.querySelector("#message-form");
const $messageBtn = $messageForm.querySelector("button");
const $messageInput = $messageForm.querySelector("#message");
const $locationBtn = document.querySelector("#send-location");
const $messagesContainer = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

const autoScroll = () => {
  const $newMessage = $messagesContainer.lastElementChild;

  const newMessageHeight =
    $newMessage.offsetHeight +
    parseInt(getComputedStyle($newMessage).marginBottom);

  // Auto scroll works when we are seeing last message
  if (
    $messagesContainer.scrollHeight - newMessageHeight <=
    $messagesContainer.scrollTop + $messagesContainer.offsetHeight
  ) {
    $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
  }
};

// SEND NEW MESSAGE
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageBtn.setAttribute("disabled", true);

  const message = e.target.elements.message.value;

  if (!message) {
    $messageBtn.removeAttribute("disabled");
    $messageInput.focus();
    return;
  }

  socket.emit("sendMessage", message, (error) => {
    $messageBtn.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();

    if (error) {
      alert(error);
    }
  });
});

// SEND LOCATION
$locationBtn.addEventListener("click", (e) => {
  e.preventDefault();

  $locationBtn.setAttribute("disabled", true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
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
    },
    () => {
      $locationBtn.removeAttribute("disabled");
    }
  );
});

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("hh:mm a"),
  });
  $messagesContainer.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

socket.on("locationMessage", (location) => {
  const html = Mustache.render(locationTemplate, {
    url: location.url,
    username: message.username,
    createdAt: moment(message.createdAt).format("hh:mm a"),
  });
  $messagesContainer.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    window.location.href = "/";
  }
});

socket.on("roomData", (roomData) => {
  const { users, room } = roomData;

  const html = Mustache.render($sidebarTemplate, {
    users,
    room,
  });

  $sidebar.innerHTML = html;
});
