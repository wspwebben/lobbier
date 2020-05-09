function* createRoomGenerator(length = 4) {
  // can create only 1000 ids
  // TODO: replace with nanoid

  let counter = 10 ** (length - 1);

  while (true) {
    const id = counter++;
    yield String(id);
  }
}

module.exports = createRoomGenerator;
