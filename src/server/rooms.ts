export type RoomId = string;

export interface Player {
  name: string;
}

export interface Room {
  id: RoomId;
  name: string;
  players: Player[];
  host: Player;
}

const rooms: Map<RoomId, Room> = new Map();

let id = 1;

export function normalizeRoomId(id: number | string): RoomId {
  return String(id).padStart(3, '0');
}

function generateRoomId(): RoomId {
  return normalizeRoomId(id++);
}

export function hasRoom(id: RoomId): boolean {
  return rooms.has(id);
}

export function createRoom(host: Player): Room {
  const id = generateRoomId();

  const room = {
    id,
    name: 'komnata',
    players: [] as Player[],
    host,
  };

  joinRoom(id, host);
  rooms.set(id, room);

  return room;
}

export function joinRoom(roomId: RoomId, player: Player) {
  if (!hasRoom(roomId)) return;

  const room = rooms.get(roomId);
  room.players.push(player);
}
