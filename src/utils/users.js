const users = [];

const addUser = ({ id, username, room }) => {
  username = username.toLowerCase().trim();
  room = room.toLowerCase().trim();

  if (!username || !room) {
    return { error: "Please enter username and room!" };
  }

  const userExisted = users.find(
    (u) => u.username === username && u.room === room
  );
  if (userExisted) {
    return { error: "Username is in use!" };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((u) => u.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((u) => u.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
