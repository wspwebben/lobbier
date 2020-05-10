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

  function createMenu(gameContainer) {
    const fragment = document.createDocumentFragment();
    const buttonCreate = createButton('Создать комнату');
    buttonCreate.addEventListener('click', () => {
      const createInterface = createHost(gameContainer);
      clearElement(gameContainer).appendChild(createInterface);
    });
    
    const buttonJoin = createButton('Присоединиться к комнате');
    buttonJoin.addEventListener('click', () => {
      const joinInterface = createJoining(gameContainer);
      clearElement(gameContainer).appendChild(joinInterface);
    });


    fragment.appendChild(buttonCreate);
    fragment.appendChild(buttonJoin);

    gameContainer.appendChild(fragment);
    return gameContainer;
  }

  const socket = io();

  const EVENTS = {
    ROOM: {
      CREATE: 'room.create',
      CREATED: 'room.created',

      JOIN: 'room.join',
      JOINED: 'room.joined',
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

  function onCreating(nameInput, roomOutput, button) {

    return () => {
      const name = nameInput.value.trim();

      if (!name) {
        console.log('Error: Name cannot be empty');
        return;
      }

      button.disabled = true;
      createRoom(name)
        .then((roomId) => {
          roomOutput.value = roomId;
          button.style.display = 'none';
        })
        .catch(() => {
          button.disabled = false;
        });
    }
  }

  function createHost(gameContainer) {
    const fragment = document.createDocumentFragment();

    const nameInput = document.createElement('input');
    nameInput.classList.add('input');
    nameInput.placeholder = 'Имя пользователя';

    const roomOutput = document.createElement('input');
    roomOutput.classList.add('input');
    roomOutput.placeholder = 'Номер комнаты';
    roomOutput.disabled = true;

    const buttonCreate = createButton('Создать комнату');
    const createListener = onCreating(nameInput, roomOutput, buttonCreate);
    buttonCreate.addEventListener('click', createListener);

    const back = () => {
      // TODO: destroy room
      buttonCreate.removeEventListener('click', createListener);
      createMenu(
        clearElement(gameContainer)
      );
    };
    const buttonBack = createButton('Назад');
    buttonBack.addEventListener('click', back);

    fragment.appendChild(buttonBack);
    fragment.appendChild(nameInput);
    fragment.appendChild(roomOutput);
    fragment.appendChild(buttonCreate);

    return fragment;
  }

  function joinRoom(name, roomId) {

    return new Promise((resolve, reject) => {
      let cancelTimeout = null;

      const onJoined = (data) => {
        // console.log(`Room id is ${roomId}, socket: ${socketId}`);
        console.log(data);

        if (cancelTimeout) {
          clearTimeout(cancelTimeout);
          cancelTimeout = null;
        }

        // resolve(roomId);
      };

      const cancelCreation = () => {
        socket.off(onJoined);
        reject();
      };

      socket.once(events.ROOM.JOINED, onJoined);
      socket.emit(events.ROOM.JOIN, {
        name,
        id: roomId,
      });

      cancelTimeout = setTimeout(cancelCreation, API_WAITING_TIME);
    });
  }

  function onJoining(nameInput, roomInput, button) {

    return () => {
      const name = nameInput.value.trim();
      const room = roomInput.value;

      if (!name) {
        console.log('Error: Name cannot be empty');
        return;
      }

      if (!room) {
        console.log('Error: Room isn\'t specified');
        return
      }

      button.disabled = true;
      joinRoom(name, room)
        .then(name => {
          console.log(`${name} joined the room`);
          button.style.display = 'none';
        })
        .catch(() => {
          button.disabled = false;
        });
    }
  }

  function createJoining(gameContainer) {
    const fragment = document.createDocumentFragment();

    const nameInput = document.createElement('input');
    nameInput.classList.add('input');
    nameInput.placeholder = 'Имя пользователя';

    const roomInput = document.createElement('input');
    roomInput.classList.add('input');
    roomInput.placeholder = 'Номер комнаты';

    const joinListener = onJoining(nameInput, roomInput);
    const buttonJoin = createButton('Присоединиться');
    buttonJoin.addEventListener('click', joinListener);

    const back = () => {
      buttonJoin.removeEventListener('click', joinListener);
      createMenu(
        clearElement(gameContainer)
      );
    };
    const buttonBack = createButton('Назад');
    buttonBack.addEventListener('click', back);

    fragment.appendChild(buttonBack);
    fragment.appendChild(nameInput);
    fragment.appendChild(roomInput);
    fragment.appendChild(buttonJoin);

    return fragment;
  }

  function createInterface(root) {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('container');

    const menu = createMenu(gameContainer);
    root.appendChild(menu);
  }

  const root = document.querySelector('#app');

  createInterface(root);

}());
