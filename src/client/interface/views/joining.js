import createButton from '../../helpers/createButton';
import update from '../update';

import joinRoom from '../../api/joinRoom';

import createMenu from './menu';
import createWatingRoom from './waiting';

function createJoining(gameContainer) {
  const updateInterface = update(gameContainer, clear);

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

        updateInterface(
          createWatingRoom(gameContainer, {
            roomId,
            name,
          })
        );
      })
      .catch(() => {
        buttonJoin.disabled = false;
      });
  }
  buttonJoin.addEventListener('click', joinListener);

  const back = () => {
    updateInterface(
      createMenu(gameContainer)
    );
  }
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

export default createJoining;