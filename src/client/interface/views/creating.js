import createButton from '../../helpers/createButton';
import update from '../update';

import createRoom from '../../api/createRoom';

import createMenu from './menu';
import createWatingRoom from './waiting';

function createHost(gameContainer) {
  const updateInterface = update(gameContainer, clear);

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
        updateInterface(
          createWatingRoom(gameContainer, {
            roomId,
            isHost: true,
          })
        );
      })
      .catch(() => {
        buttonCreate.disabled = false;
      });
  }
  buttonCreate.addEventListener('click', createListener);

  const back = () => {
    updateInterface(
      createMenu(gameContainer)
    );
  }
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

export default createHost;