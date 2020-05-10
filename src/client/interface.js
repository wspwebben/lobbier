import { createMenu } from './interface/index';
import update from './interface/update';

function createInterface(root) {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container');

  const updateInterface = update(gameContainer);
  updateInterface(
    createMenu(gameContainer)
  );
  root.appendChild(gameContainer);
}

export default createInterface;