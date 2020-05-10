import createButton from '../helpers/createButton';
import clearElement from '../helpers/clearElement';

import createHost from './createHost';
import createJoining from './createJoining';

function createMenu(gameContainer) {
  const fragment = document.createDocumentFragment();
  const buttonCreate = createButton('Создать комнату');
  buttonCreate.addEventListener('click', () => {
    const createInterface = createHost(gameContainer);
    clearElement(gameContainer).appendChild(createInterface);
  })
  
  const buttonJoin = createButton('Присоединиться к комнате');
  buttonJoin.addEventListener('click', () => {
    const joinInterface = createJoining(gameContainer);
    clearElement(gameContainer).appendChild(joinInterface);
  })


  fragment.appendChild(buttonCreate);
  fragment.appendChild(buttonJoin);

  gameContainer.appendChild(fragment);
  return gameContainer;
}

export default createMenu;