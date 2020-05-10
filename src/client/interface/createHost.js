import createButton from '../helpers/createButton';
import clearElement from '../helpers/clearElement';

import createMenu from './createMenu';

import createRoom from '../api/createRoom';

function onCreating(nameInput, roomOutput) {

  return () => {
    const name = nameInput.value.trim();

    if (!name) {
      console.log('Error: Name cannot be empty');
      return;
    }

    createRoom(name);
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

  const createListener = onCreating(nameInput, roomOutput);
  const buttonCreate = createButton('Создать комнату');
  buttonCreate.addEventListener('click', createListener);

  const back = () => {
    buttonCreate.removeEventListener('click', createListener);
    createMenu(
      clearElement(gameContainer)
    );
  }
  const buttonBack = createButton('Назад');
  buttonBack.addEventListener('click', back);

  fragment.appendChild(buttonBack);
  fragment.appendChild(nameInput);
  fragment.appendChild(roomOutput);
  fragment.appendChild(buttonCreate);

  gameContainer.appendChild(fragment);
  return gameContainer;
}

export default createHost;