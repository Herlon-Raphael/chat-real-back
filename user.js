const users = [];

const addUser = (id) => {
  const user = id;

  users.push(user);
  return user;
};

const getUser = (id) => users.find((user) => user === id);

module.exports = { addUser, getUser };
