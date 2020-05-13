function createUser(name, isHost = false) {
  const user = document.createElement('li');
  user.classList.add('user');
  user.classList.toggle('is-host', isHost);
  
  user.textContent = name;
  return user;
}

function createUserList(users = []) {
  const usersList = document.createElement('ul');
  usersList.classList.add('users');

  const addUser = ({ name, isHost }) => {
    usersList.appendChild(createUser(name, isHost))
  }

  users.forEach(addUser);

  return [usersList, addUser];
}

export default createUserList;
