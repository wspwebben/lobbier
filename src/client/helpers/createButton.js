export default (text) => {
  const button = document.createElement('button');
  button.classList.add('button');
  button.textContent = text;

  return button;
}