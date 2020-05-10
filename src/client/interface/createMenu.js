import createButton from '../helpers/createButton';
import clearElement from '../helpers/clearElement';

import createHost from './createHost';

function createMenu(gameContainer) {
  const fragment = document.createDocumentFragment();
  const buttonCreate = createButton('Создать комнату');
  buttonCreate.addEventListener('click', () => {
    createHost(
      clearElement(gameContainer)
    );
  })
  
  const buttonJoin = createButton('Присоединиться к комнате');


  fragment.appendChild(buttonCreate);
  fragment.appendChild(buttonJoin);

  gameContainer.appendChild(fragment);
  return gameContainer;
}

export default createMenu;