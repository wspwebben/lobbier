import test from './interface/views/test';
import update from './interface/update';

function createInterface(root) {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container');

  const updateInterface = update(gameContainer, () => {});
  updateInterface(
    test(gameContainer)
  );
  root.appendChild(gameContainer);
}

export default createInterface;