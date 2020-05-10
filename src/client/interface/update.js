import clearElement from '../helpers/clearElement';

function updateInterface(gameContainer) {

  return function(newInterface) {
    clearElement(gameContainer).appendChild(newInterface);
  }
}

export default updateInterface;
