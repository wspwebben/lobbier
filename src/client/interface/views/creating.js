import createButton from '../../helpers/createButton';
import update from '../update';

import { createMenu } from '../index';

import createRoom from '../../api/createRoom';

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
      })
  }
}

function createHost(gameContainer) {
  const updateInterface = update(gameContainer);

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
    updateInterface(
      createMenu(gameContainer)
    );
  }
  const buttonBack = createButton('Назад');
  buttonBack.addEventListener('click', back);

  fragment.appendChild(buttonBack);
  fragment.appendChild(nameInput);
  fragment.appendChild(roomOutput);
  fragment.appendChild(buttonCreate);

  return fragment;
}

export default createHost;