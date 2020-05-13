import clearElement from '../helpers/clearElement';

function updateInterface(gameContainer, clear) {
  if (!clear) {
    clear = () => {
      console.trace('No clearing function passed');
    };
  }

  return function(newInterface) {
    clear();
    clearElement(gameContainer).appendChild(newInterface);
  }
}

export default updateInterface;
