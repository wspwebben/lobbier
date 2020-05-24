export default (text, isDisabled = false) => {
  const button = document.createElement('button');
  button.classList.add('button');
  button.textContent = text;
  button.disabled = isDisabled;

  return button;
}