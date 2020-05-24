import socket from '../../api/socket';

import createButton from '../../helpers/createButton';

import take from '../test/take';
import decline from '../test/decline';

const startButton = createButton('Начать игру', true);
const takeButton = createButton('Взять', true);
const declineButton = createButton('Отклонить', true);

takeButton.addEventListener('click', take);
declineButton.addEventListener('click', decline);

startButton.addEventListener('click', () => {
  socket.emit('game-start');
  startButton.disabled = true;
})

socket.on('enough-players', isEnough => {
  startButton.disabled = !isEnough;
})

socket.on('game-start', () => {
  startButton.remove();
  takeButton.disabled = false;
  declineButton.disabled = false;

  console.log(socket.id);
})

socket.on('game', (data) => {
  console.log(data);
})

function test() {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(startButton);
  fragment.appendChild(takeButton);
  fragment.appendChild(declineButton);

  return fragment;
}

export default test;
