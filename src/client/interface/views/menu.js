import createButton from '../../helpers/createButton';
import update from '../update';

import createHost from './creating';
import createJoining from './joining';

function createMenu(gameContainer) {
  const updateInterface = update(gameContainer);

  const fragment = document.createDocumentFragment();
  const buttonCreate = createButton('Создать комнату');
  buttonCreate.addEventListener('click', () => {
    updateInterface(
      createHost(gameContainer, createMenu)
    );
  })
  
  const buttonJoin = createButton('Присоединиться к комнате');
  buttonJoin.addEventListener('click', () => {
    updateInterface(
      createJoining(gameContainer, createMenu)
    );
  })

  fragment.appendChild(buttonCreate);
  fragment.appendChild(buttonJoin);

  return fragment;
}

export default createMenu;