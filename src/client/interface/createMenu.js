import createButton from '../helpers/createButton';
import clearElement from '../helpers/clearElement';

function createMenu(gameContainer) {
  const fragment = document.createDocumentFragment();
  const buttonCreate = createButton('Создать комнату');
  fragment.appendChild(buttonCreate);

  const buttonJoin = createButton('Присоединиться к комнате');
  fragment.appendChild(buttonJoin);

  clearElement(gameContainer).appendChild(fragment);
  return gameContainer;
}

export default createMenu;