import createButton from '../../helpers/createButton';
import update from '../update';

import { createHost, createJoining } from '../index';

function createMenu(gameContainer) {
  const updateInterface = update(gameContainer);

  const fragment = document.createDocumentFragment();
  const buttonCreate = createButton('Создать комнату');
  buttonCreate.addEventListener('click', () => {
    updateInterface(
      createHost(gameContainer)
    );
  })
  
  const buttonJoin = createButton('Присоединиться к комнате');
  buttonJoin.addEventListener('click', () => {
    updateInterface(
      createJoining(gameContainer)
    );
  })

  fragment.appendChild(buttonCreate);
  fragment.appendChild(buttonJoin);

  return fragment;
}

export default createMenu;