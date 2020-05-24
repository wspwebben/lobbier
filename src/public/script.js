(function () {
  'use strict';

  const socket = io();

  var createButton = (text, isDisabled = false) => {
    const button = document.createElement('button');
    button.classList.add('button');
    button.textContent = text;
    button.disabled = isDisabled;

    return button;
  };

  function take() {
    socket.emit('game', {
      id: socket.id,
      move: 'take',
    });
  }

  function decline() {
    socket.emit('game', {
      id: socket.id,
      move: 'decline',
    });
  }

  const startButton = createButton('Начать игру', true);
  const takeButton = createButton('Взять', true);
  const declineButton = createButton('Отклонить', true);

  takeButton.addEventListener('click', take);
  declineButton.addEventListener('click', decline);

  startButton.addEventListener('click', () => {
    socket.emit('game-start');
    startButton.disabled = true;
  });

  socket.on('enough-players', isEnough => {
    startButton.disabled = !isEnough;
  });

  socket.on('game-start', () => {
    startButton.remove();
    takeButton.disabled = false;
    declineButton.disabled = false;

    console.log(socket.id);
  });

  socket.on('game', (data) => {
    console.log(data);
  });

  function test() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(startButton);
    fragment.appendChild(takeButton);
    fragment.appendChild(declineButton);

    return fragment;
  }

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

  function createInterface(root) {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('container');

    const updateInterface$1 = updateInterface(gameContainer, () => {});
    updateInterface$1(
      test()
    );
    root.appendChild(gameContainer);
  }

  const root = document.querySelector('#app');

  createInterface(root);

}());
