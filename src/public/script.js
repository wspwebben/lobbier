const socket = io();

const EVENTS = {
  ROOM_CREATE: 'room.create',
  ROOM_CREATED: 'room.created',
  ROOM_JOIN: 'room.join',
  ROOM_JOINED: 'room.joined',
}

socket.on('msg', (msg) => {
  console.log(msg);
})


const nicknameClass = 'js-nickname'
const nicknameField = document.querySelector(`.${nicknameClass}`)

function getNickname() {
  return nicknameField.value.trim()
}

const createClass = 'js-create'
const createRoot = document.querySelector(`.${createClass}`)
const createButton = createRoot.querySelector(`.${createClass}__button`)
createButton.addEventListener('click', createRoom)

function createRoom() {
  const nickname = getNickname()
  if (!nickname) {
    console.error('Nickname cant be empty')
    return
  }

  let cancelTimeout = null

  const cancelCreation = () => {
    socket.off(onCreated)
    createButton.disabled = false;
    console.log('Room hasnt been created')
  }

  const onCreated = ({ roomId }) => {
    console.log(`Room id is ${roomId}`)
    createButton.style.display = 'none'

    if (cancelTimeout) {
      clearTimeout(cancelTimeout)
      cancelTimeout = null
    }
  }

  createButton.disabled = true;
  cancelTimeout = setTimeout(cancelCreation, 1000)
  socket.once(EVENTS.ROOM_CREATED, onCreated)

  socket.emit(EVENTS.ROOM_CREATE, {
    name: nickname
  })
}



const joinClass = 'js-join'
const joinRoot = document.querySelector(`.${joinClass}`)
const joinButton = joinRoot.querySelector(`.${joinClass}__button`)
const joinId = joinRoot.querySelector(`.${joinClass}__id`)
joinButton.addEventListener('click', joinRoom);

function joinRoom() {
  const nickname = getNickname()
  if (!nickname) {
    console.error('Nickname cant be empty')
    return
  }

  const id = joinId.value.trim()
  if (!id) return

  socket.emit(EVENTS.ROOM_JOIN, {
    name: nickname,
    id
  })
}
