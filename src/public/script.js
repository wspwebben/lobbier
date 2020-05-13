(function () {
  'use strict';

  var createButton = (text) => {
    const button = document.createElement('button');
    button.classList.add('button');
    button.textContent = text;

    return button;
  };

  var clearElement = (element) => {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }

    return element;
  };

  function updateInterface(gameContainer, clear) {
    if (!clear) {
      clear = () => {
        console.trace('No clearing function passed');
      };
    }

    return function(newInterface) {
      clear();
      clearElement(gameContainer).appendChild(newInterface);
    }
  }

  const socket = io();

  const EVENTS = {
    ROOM: {
      CREATE: 'room.create',
      CREATED: 'room.created',

      JOIN: 'room.join',
      JOINED: 'room.joined',

      LEAVE: 'room.leave',
      LEFT: 'room.left',
    },

    ERROR: {
      NO_ROOM: 'error.no-room'
    }
  };

  var events = EVENTS;

  const API_WAITING_TIME = 2000;

  function createRoom(name) {
    console.log(`${name} is trying to create a room`);

    return new Promise((resolve, reject) => {
      let cancelTimeout = null;

      const onCreated = ({ roomId, socketId }) => {
        console.log(`Room id is ${roomId}, socket: ${socketId}`);
    
        if (cancelTimeout) {
          clearTimeout(cancelTimeout);
          cancelTimeout = null;
        }

        resolve(roomId);
      };

      const cancelCreation = () => {
        console.log('Room hasnt been created');

        socket.off(onCreated);
        reject();
      };

      socket.once(events.ROOM.CREATED, onCreated);
      socket.emit(events.ROOM.CREATE, {
        name,
      });

      cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
    });
    
  }

  function leaveRoom(name, roomId) {
    return new Promise((resolve, reject) => {

      const onLeft = () => {
        console.log('Left the room');
        resolve();
      };

      socket.once(events.ROOM.LEFT, onLeft);
      socket.emit(events.ROOM.LEAVE, {
        name,
        id: roomId,
      });
    })
  }

  function startGame(roomId) {
    
  }

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
      usersList.appendChild(createUser(name, isHost));
    };

    users.forEach(addUser);

    return [usersList, addUser];
  }

  function createWatingRoom(gameContainer, payload) {
    const updateInterface$1 = updateInterface(gameContainer, clear);

    const { roomId, name, isHost = false } = payload;

    const fragment = document.createDocumentFragment();

    let roomTitle = document.createElement('h2');
    roomTitle.classList.add('room');
    roomTitle.textContent = `Номер комнаты: ${roomId}`;

    let [usersList, addUser] = createUserList();


    let buttonStart = createButton('Начать игру');
    buttonStart.disabled = true;
    const startListener = () => {
      buttonStart.disabled = true;
      startGame()
        .then(() => {

        })
        .catch((e) => {
          console.error(e);
          buttonStart.disabled = false;
        });
    };
    buttonStart.addEventListener('click', startListener);

    const back = () => {
      leaveRoom(name, roomId)
        .then(() => {
          updateInterface$1(
            createMenu(gameContainer)
          );
        })
        .catch((e) => {
          console.error(e);
          button.disabled = false;
        });
    };
    let buttonBack = createButton('Выйти из комнаты');
    buttonBack.addEventListener('click', back);

    fragment.appendChild(buttonBack);
    fragment.appendChild(roomTitle);
    fragment.appendChild(usersList);

    if (isHost) {
      fragment.appendChild(buttonStart);
    }

    function clear() {
      buttonStart.removeEventListener('click', startListener);
      buttonBack.removeEventListener('click', back);

      buttonBack = null;
      roomTitle = null;
      usersList = null;
      buttonStart = null;
    }

    return fragment;
  }

  function createHost(gameContainer) {
    const updateInterface$1 = updateInterface(gameContainer, clear);

    const fragment = document.createDocumentFragment();

    const nameInput = document.createElement('input');
    nameInput.classList.add('input');
    nameInput.placeholder = 'Имя пользователя';

    const buttonCreate = createButton('Создать комнату');
    const createListener = () => {
      const name = nameInput.value.trim();

      if (!name) {
        console.log('Error: Name cannot be empty');
        return;
      }

      buttonCreate.disabled = true;
      createRoom(name)
        .then((roomId) => {
          updateInterface$1(
            createWatingRoom(gameContainer, {
              roomId,
              isHost: true,
            })
          );
        })
        .catch(() => {
          buttonCreate.disabled = false;
        });
    };
    buttonCreate.addEventListener('click', createListener);

    const back = () => {
      updateInterface$1(
        createMenu(gameContainer)
      );
    };
    const buttonBack = createButton('Назад');
    buttonBack.addEventListener('click', back);

    fragment.appendChild(buttonBack);
    fragment.appendChild(nameInput);
    fragment.appendChild(buttonCreate);

    function clear() {
      buttonCreate.removeEventListener('click', createListener);
      buttonBack.removeEventListener('click', back);
    }

    return fragment;
  }

  function joinRoom(name, roomId) {

    return new Promise((resolve, reject) => {
      let cancelTimeout = null;

      const onJoined = ({ name }) => {
        if (cancelTimeout) {
          clearTimeout(cancelTimeout);
          cancelTimeout = null;
        }

        resolve(name);
      };

      const onNoRoom = () => {
        reject();
      };

      const cancelCreation = () => {
        socket.off(events.ROOM.JOINED, onJoined);
        socket.off(events.ERROR.NO_ROOM, onNoRoom);
        reject();
      };

      socket.once(events.ROOM.JOINED, onJoined);
      socket.once(events.ERROR.NO_ROOM, onNoRoom);
      socket.emit(events.ROOM.JOIN, {
        name,
        id: roomId,
      });

      cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
    });
  }

  function createJoining(gameContainer) {
    const updateInterface$1 = updateInterface(gameContainer, clear);

    const fragment = document.createDocumentFragment();

    let nameInput = document.createElement('input');
    nameInput.classList.add('input');
    nameInput.placeholder = 'Имя пользователя';

    let roomInput = document.createElement('input');
    roomInput.classList.add('input');
    roomInput.placeholder = 'Номер комнаты';

    let buttonJoin = createButton('Присоединиться');
    const joinListener = () => {
      const name = nameInput.value.trim();
      const roomId = roomInput.value;

      if (!name) {
        console.log('Error: Name cannot be empty');
        return;
      }

      if (!roomId) {
        console.log('Error: Room isn\'t specified');
        return
      }

      buttonJoin.disabled = true;
      joinRoom(name, roomId)
        .then(name => {
          console.log(`${name} joined the room`);

          updateInterface$1(
            createWatingRoom(gameContainer, {
              roomId,
              name,
            })
          );
        })
        .catch(() => {
          buttonJoin.disabled = false;
        });
    };
    buttonJoin.addEventListener('click', joinListener);

    const back = () => {
      updateInterface$1(
        createMenu(gameContainer)
      );
    };
    let buttonBack = createButton('Назад');
    buttonBack.addEventListener('click', back);

    fragment.appendChild(buttonBack);
    fragment.appendChild(nameInput);
    fragment.appendChild(roomInput);
    fragment.appendChild(buttonJoin);
    
    function clear() {
      buttonJoin.removeEventListener('click', joinListener);
      buttonBack.removeEventListener('click', back);

      buttonBack = null;
      nameInput = null;
      roomInput = null;
      buttonJoin = null;
    }

    return fragment;
  }

  function createMenu(gameContainer) {
    const updateInterface$1 = updateInterface(gameContainer);

    const fragment = document.createDocumentFragment();
    const buttonCreate = createButton('Создать комнату');
    buttonCreate.addEventListener('click', () => {
      updateInterface$1(
        createHost(gameContainer)
      );
    });
    
    const buttonJoin = createButton('Присоединиться к комнате');
    buttonJoin.addEventListener('click', () => {
      updateInterface$1(
        createJoining(gameContainer)
      );
    });

    fragment.appendChild(buttonCreate);
    fragment.appendChild(buttonJoin);

    return fragment;
  }

  function createInterface(root) {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('container');

    const updateInterface$1 = updateInterface(gameContainer);
    updateInterface$1(
      createMenu(gameContainer)
    );
    root.appendChild(gameContainer);
  }

  const root = document.querySelector('#app');

  createInterface(root);

}());
