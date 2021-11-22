import { validate, parse } from 'fast-xml-parser';

const _amountRegex = /^\d+/;
const _collectorRegex = /\d+$/;
const _setRegex = /(\(|\[)(.+)(\)|\])/;
function parseString(rawInput) {
  rawInput = rawInput.trim();
  const name = rawInput.replace(_amountRegex, '').replace(_setRegex, '').replace(_collectorRegex, '').trim();
  const amount = rawInput.match(_amountRegex);
  const set = rawInput.match(_setRegex);
  const collectors = rawInput.match(_collectorRegex);
  return {
    name,
    amount: amount ? parseInt(amount[0]) : undefined,
    set: set ? set[2] : undefined,
    collectors: collectors ? parseInt(collectors[0]) : undefined
  };
}
function toCardString(card) {
  return [card.amount || 1, toCardStringWithoutAmount(card)].filter(s => s !== null && s !== void 0 ? s : false).join(' ');
}
function toCardStringWithoutAmount(card) {
  var _card$set;

  return [card.name, (_card$set = card.set) !== null && _card$set !== void 0 && _card$set.length ? `(${card.set})` : undefined, card.collectors].filter(s => s !== null && s !== void 0 ? s : false).join(' ');
}
function toDeckListString(deck) {
  var _deck$deck, _deck$sideboard;

  let output = [];

  if (deck.commander) {
    output.push(`Commander`);
    output.push(deck.commander.toCardString());
    output.push('');
  }

  if (deck.companion) {
    output.push(`Companion`);
    output.push(deck.companion.toCardString());
    output.push('');
  }

  if ((_deck$deck = deck.deck) !== null && _deck$deck !== void 0 && _deck$deck.length) {
    output.push(`Deck`);
    deck.deck.forEach(card => {
      output.push(card.toCardString());
    });
    output.push('');
  }

  if ((_deck$sideboard = deck.sideboard) !== null && _deck$sideboard !== void 0 && _deck$sideboard.length) {
    output.push(`Sideboard`);
    deck.sideboard.forEach(card => {
      output.push(card.toCardString());
    });
    output.push('');
  }

  return output.join('\n');
}

class CardModel {
  constructor(rawInput) {
    const {
      amount,
      name,
      set,
      collectors,
      mtgoID
    } = typeof rawInput === 'string' ? this.parseString(rawInput) : this.parseObject(rawInput);
    this.name = name;
    this.amount = amount;
    this.set = set;
    this.collectors = collectors;
    this.mtgoID = mtgoID;
  }

  parseString(rawInput) {
    return parseString(rawInput);
  }

  parseObject(rawInputObject) {
    return {
      name: rawInputObject.Name,
      amount: parseInt(rawInputObject.Quantity),
      mtgoID: rawInputObject.CatID
    };
  }

  toCardString() {
    return toCardString(this);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Deck {
  constructor() {
    _defineProperty(this, "valid", false);

    _defineProperty(this, "deck", []);

    _defineProperty(this, "sideboard", []);

    _defineProperty(this, "companion", null);

    _defineProperty(this, "commander", null);
  }

  toDeckListString() {
    return toDeckListString(this);
  }

}

var SECTIONS;

(function (SECTIONS) {
  SECTIONS[SECTIONS["unstarted"] = 0] = "unstarted";
  SECTIONS[SECTIONS["commander"] = 1] = "commander";
  SECTIONS[SECTIONS["companion"] = 2] = "companion";
  SECTIONS[SECTIONS["deck"] = 3] = "deck";
  SECTIONS[SECTIONS["sideboard"] = 4] = "sideboard";
})(SECTIONS || (SECTIONS = {}));
const _deckRegex = /^deck$/i;
const _sideboardRegex = /^sideboard$/i;
const _commanderRegex = /^commander$/i;
const _companionRegex = /^companion$/i;
const _newlineRegex = /\n/g;
class Decklist extends Deck {
  constructor(rawInput) {
    super();
    let splitData = rawInput.toString().trim().split(_newlineRegex);
    let currentSection = 0;

    try {
      splitData.forEach(line => {
        line = line.trim();

        if (line.match(_commanderRegex)) {
          currentSection = 1;
          return;
        } else if (line.match(_companionRegex)) {
          currentSection = 2;
          return;
        } else if (line.match(_deckRegex)) {
          currentSection = 3;
          return;
        } else if (currentSection === 0 && line.length > 0) {
          currentSection = 3;
        } else if (line.match(_sideboardRegex) || currentSection === 3 && line.length === 0) {
          currentSection = 4;
          return;
        } else if (line.length === 0) {
          return;
        }

        switch (currentSection) {
          case 1:
            this.commander = new CardModel(line);
            break;

          case 2:
            this.companion = new CardModel(line);
            break;

          case 3:
            this.deck.push(new CardModel(line));
            break;

          case 4:
            this.sideboard.push(new CardModel(line));
            break;
        }
      });
      this.valid = true;
    } catch (error) {
      this.valid = false;
      console.error(error);
    }
  }

}

const _commanderAnnotation = '16777728';
class MTGO extends Deck {
  constructor(xml, logError = true) {
    super();
    xml = xml.toString().trim();
    const output = validate(xml);
    this.valid = output === true;

    if (this.valid) {
      const parsed = parse(xml, {
        attributeNamePrefix: '',
        ignoreAttributes: false
      });
      parsed.Deck.Cards.forEach(card => {
        if (card.Annotation === _commanderAnnotation) {
          this.commander = new CardModel(card);
        } else if (card.Sideboard === 'true') {
          this.sideboard.push(new CardModel(card));
        } else {
          this.deck.push(new CardModel(card));
        }
      });
    } else if (logError) {
      console.error(output.err);
    }
  }

}

function autoParse(rawInput) {
  const deck = new MTGO(rawInput, false);
  return deck.valid ? deck : new Decklist(rawInput);
}

export { CardModel, Decklist, MTGO, autoParse, autoParse as default, parseString, toCardString, toCardStringWithoutAmount, toDeckListString };
//# sourceMappingURL=index.esm.js.map
