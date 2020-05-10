import { createMenu } from './interface/index';

function createInterface(root) {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container');

  const menu = createMenu(gameContainer);
  root.appendChild(menu);
}

export default createInterface;