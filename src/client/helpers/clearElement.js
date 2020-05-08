export default (element) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }

  return element;
}