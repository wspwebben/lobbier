import createButton from '../../helpers/createButton';
import update from '../update';

import leaveRoom from '../../api/leaveRoom';
import startGame from '../../api/startGame';

import createMenu from './menu';

import createUserList from '../components/userList';

function createWatingRoom(gameContainer, payload) {
  const updateInterface = update(gameContainer, clear);

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
    startGame(roomId)
      .then(() => {

      })
      .catch((e) => {
        console.error(e);
        buttonStart.disabled = false;
      })
  };
  buttonStart.addEventListener('click', startListener);

  const back = () => {
    leaveRoom(name, roomId)
      .then(() => {
        updateInterface(
          createMenu(gameContainer)
        );
      })
      .catch((e) => {
        console.error(e);
        button.disabled = false;
      })
  }
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

export default createWatingRoom;