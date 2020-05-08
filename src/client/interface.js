const createButton = (text) => {
  const button = document.createElement('button');
  button.classList.add('button');
  button.textContent = text;
  return button;
}

function createInterface(root) {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container');

  const buttonCreate = createButton('Создать комнату');
  gameContainer.appendChild(buttonCreate);

  const buttonJoin = createButton('Присоединиться к комнате');
  gameContainer.appendChild(buttonJoin);

  root.appendChild(gameContainer);
}

export default createInterface;