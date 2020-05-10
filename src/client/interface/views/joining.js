import createButton from '../../helpers/createButton';
import update from '../update';

import joinRoom from '../../api/joinRoom';

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

function createJoining(gameContainer, previousView) {
  const updateInterface = update(gameContainer);

  const fragment = document.createDocumentFragment();

  const nameInput = document.createElement('input');
  nameInput.classList.add('input');
  nameInput.placeholder = 'Имя пользователя';

  const roomInput = document.createElement('input');
  roomInput.classList.add('input');
  roomInput.placeholder = 'Номер комнаты';

  const buttonJoin = createButton('Присоединиться');
  const joinListener = onJoining(nameInput, roomInput, buttonJoin);
  buttonJoin.addEventListener('click', joinListener);

  const back = () => {
    buttonJoin.removeEventListener('click', joinListener);
    updateInterface(
      previousView(gameContainer)
    );
  }
  const buttonBack = createButton('Назад');
  buttonBack.addEventListener('click', back);

  fragment.appendChild(buttonBack);
  fragment.appendChild(nameInput);
  fragment.appendChild(roomInput);
  fragment.appendChild(buttonJoin);

  return fragment;
}

export default createJoining;