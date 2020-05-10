const EVENTS = {
  ROOM: {
    CREATE: 'room.create',
    CREATED: 'room.created',

    JOIN: 'room.join',
    JOINED: 'room.joined',
  },

  ERROR: {
    NO_ROOM: 'error.no-room'
  }
}

module.exports = EVENTS;
