'use strict';

const TOTAL_MONEY = 55;
const MAX_MONEY = 11;

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 7;

const REMOVED_CARDS = 9;
const MIN_VALUE = 3;
const MAX_VALUE = 35;

const REFUSE_COST = 1;
const INITIAL_BANK = 0;

const MOVE_DECLINE = 'decline';
const MOVE_TAKE = 'take';

function shuffle (source) {
  const array = [...source];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

function createDeck (min, max, slice) {
  const deck = Array.from({ length: (max - min + 1) }, (_, i) => min + i);
  const shuffled = shuffle(deck);

  return shuffled.slice(0, -slice)
}

function pushCard (number, source) {
  const stacks = [...source];

  for (let i = 0; i < stacks.length; i += 1) {
    const [first, last] = stacks[i];

    if (number + 1 < first) {
      stacks.splice(i, 0, [number, number]);
      return stacks
    }

    if (number + 1 === first) {
      stacks[i] = [number, last];
      return stacks
    }

    if (number - 1 === last) {
      // нужно проверить следующий интервал, возможно требуется их склеить
      const nextStack = stacks[i + 1];

      if (nextStack) {
        const [nextFirst, nextLast] = nextStack;
        if (number + 1 === nextFirst) {
          stacks.splice(i, 2, [first, nextLast]);
          return stacks
        }
      }

      stacks[i] = [first, number];
      return stacks
    }
  }

  stacks.push([number, number]);
  return stacks
}

function getStackScore (stack) {
  return stack.reduce((score, [lowest]) => score + lowest, 0)
}

class Player {
  constructor(name, id, money) {
    this.id = id;
    this.name = name;
    this.money = money;
    this.stack = [];
  }

  get stackScore() {
    return getStackScore(this.stack);
  }

  get totalScore() {
    return this.stackScore - this.money;
  }

  get canDecline() {
    return this.money >= REFUSE_COST;
  }

  get publicInfo() {
    return {
      id: this.id,
      name: this.name,
      stack: this.stack,
      score: this.stackScore,
    };
  }

  get privateInfo() {
    return {
      ...this.publicInfo,
      money: this.money,
      score: this.totalScore,
    };
  }

  declineCard() {
    if (this.canDecline) {
      this.money -= REFUSE_COST;
      return REFUSE_COST;
    }

    return 0;
  }

  takeCard(card, bank) {
    this.stack = pushCard(card, this.stack);
    this.money += bank;
  }
}

function getMoneyCount (players) {
  return Math.min(MAX_MONEY, Math.floor(TOTAL_MONEY / players))
}

function * createIdGenerator (start = 1) {
  let currentId = start;

  while (true) {
    yield currentId++;
  }
}

function createPlayers (playersData) {
  if (playersData.length < MIN_PLAYERS) {
    throw new Error('There\'s not enough playerys')
  }

  if (playersData.length > MAX_PLAYERS) {
    throw new Error('There\'s too much playerys')
  }

  const idGenerator = createIdGenerator();
  const startingMoney = getMoneyCount(playersData.length);


  return playersData.map(({ name }) => {
    const { value: id } = idGenerator.next();
    return new Player(name, id, startingMoney);
  });
}

function createNextPlayer (players) {
  const playersCount = players.length;

  return function (currentPlayer) {
    const index = players.findIndex(player => player.id === currentPlayer.id);
    const nextIndex = (index + 1) % playersCount;

    return players[nextIndex]
  }
}

function * createGame (playersData) {
  const deck = createDeck(MIN_VALUE, MAX_VALUE, REMOVED_CARDS);
  const players = createPlayers(playersData);
  const getNextPlayer = createNextPlayer(players);

  let [currentPlayer] = players;
  let bank = INITIAL_BANK;

  const getPublicInfo = () => players.map(player => player.publicInfo);
  const getPrivateInfo = () => players.map(player => player.privateInfo);
  const getGameState = (card) => ({
    card,
    bank,
    cardsLeft: deck.length,
    currentPlayer: currentPlayer.id,
    players: getPublicInfo(),
    _private: getPrivateInfo(),
  });

  while (deck.length) {
    const card = deck.pop();

    let isCardFree = true;

    while (isCardFree) {
      const move = yield {
        ...getGameState(card)
      };

      switch (move) {
        case MOVE_DECLINE: {
          if (currentPlayer.canDecline) {
            const payment =  currentPlayer.declineCard();
            bank += payment;

            currentPlayer = getNextPlayer(currentPlayer);
          }
          break;
        }
        case MOVE_TAKE: {
          currentPlayer.takeCard(card, bank);
          bank = 0;

          isCardFree = false;
          break;
        }
      }
    }
  }

  const scoredPlayers = players.map(player => ({ 
    ...player.privateInfo
  })).sort((a, b) => a.score - b.score)
    .map((player, index) => ({ 
      ...player,
      place: index + 1
    }));

    console.log(scoredPlayers)
  return {
    players: scoredPlayers
  }
}

const EVENTS = {
  GAME: 'game',
};

class Game {
  constructor(sockets, players) {
    this.sockets = sockets;
    this.isPlaying = true;

    this.onMessage = this.onMessage.bind(this);
    this.bindEvents();

    this.game = createGame(players);
    const { value: state } = this.game.next();
    this.sendGameState(state);
  }

  bindEvents() {
    this.sockets.forEach(socket => {
      socket.on(EVENTS.GAME, this.onMessage);
    })
  }

  unbindEvents() {
    this.sockets.forEach(socket => {
      socket.off(EVENTS.GAME, this.onMessage);
    })
  }

  isCurrentPlayer(id) {
    return true;
  }

  onMessage({ id, move }) {
    console.log(move);
    // if (!this.isPlaying) return;
    if (![MOVE_DECLINE, MOVE_TAKE].includes(move)) return;
    if (!this.isCurrentPlayer(id)) return
    
    this.nextTurn(move);
  }

  nextTurn(move) {
    const { value: state, done } = this.game.next(move);

    if (done) {
      // console.log(state);
      this.sendPlayersScore(state.players);
      return;
    }

    this.sendGameState(state);
  }

  sendGameState(state) {
    this.sockets.forEach(socket => {
      socket.emit(EVENTS.GAME, state);
    })
  }

  sendPlayersScore(players) {
    this.isPlaying = false;
    this.unbindEvents();
    // this.socket.emit('game', players)
  }
}

module.exports = Game;
