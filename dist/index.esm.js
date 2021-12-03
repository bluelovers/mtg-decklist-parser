import { lineSplit } from 'crlf-normalize';
import { validate, parse } from 'fast-xml-parser';

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

const _collectorRegex = /\d+$/;
const _setRegex = /(\(|\[)([a-z].+)(\)|\])/i;
function parseString(rawInput) {
  rawInput = rawInput.trim();
  let m_amount = rawInput.match(/^(\d+)x?\s+/);

  if (m_amount) {
    var _rawInput$match, _rawInput$match2;

    const amount = parseInt(m_amount[1]);
    const name = rawInput.slice(m_amount[0].length).replace(_setRegex, '').replace(_collectorRegex, '').trim();
    const set = (_rawInput$match = rawInput.match(_setRegex)) === null || _rawInput$match === void 0 ? void 0 : _rawInput$match[2];
    const collectors = (_rawInput$match2 = rawInput.match(_collectorRegex)) === null || _rawInput$match2 === void 0 ? void 0 : _rawInput$match2[0];
    return {
      name,
      amount,
      set,
      collectors: set && collectors ? parseInt(collectors) : undefined
    };
  }

  throw new SyntaxError(`Invalid format: ${rawInput}`);
}
function toCardString(card) {
  return [card.amount || 1, toCardStringWithoutAmount(card)].filter(s => s !== null && s !== void 0 ? s : false).join(' ');
}
function toMtgifyCardString(card) {
  return [(card.amount || 1) + 'x', card.name].filter(s => s !== null && s !== void 0 ? s : false).join(' ');
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
    var _rawInputObject$Quant, _rawInputObject$Name, _rawInputObject$CatID;

    let collectors = rawInputObject.collectors;

    if (typeof collectors === 'string') {
      collectors = parseInt(collectors);
    }

    let amount = parseInt((_rawInputObject$Quant = rawInputObject.Quantity) !== null && _rawInputObject$Quant !== void 0 ? _rawInputObject$Quant : rawInputObject.amount) | 0;

    if (!amount || !Number.isInteger(amount) || amount < 0) {
      amount = void 0;
    }

    return {
      name: (_rawInputObject$Name = rawInputObject.Name) !== null && _rawInputObject$Name !== void 0 ? _rawInputObject$Name : rawInputObject.name,
      amount,
      mtgoID: (_rawInputObject$CatID = rawInputObject.CatID) !== null && _rawInputObject$CatID !== void 0 ? _rawInputObject$CatID : rawInputObject.mtgoID,
      set: rawInputObject.set,
      collectors
    };
  }

  toCardString() {
    return toCardString(this);
  }

}

class AbstractDeck {
  constructor() {
    _defineProperty(this, "valid", false);

    _defineProperty(this, "deck", []);

    _defineProperty(this, "sideboard", []);

    _defineProperty(this, "companion", null);

    _defineProperty(this, "commander", null);

    this.valid = false;
  }

  toDeckListString() {
    return toDeckListString(this);
  }

  _newCardModel(rawInput, amount) {
    const card = new CardModel(rawInput);
    card.amount = amount !== null && amount !== void 0 ? amount : card.amount;
    return card;
  }

}

const SymDecklistType = /*#__PURE__*/Symbol.for(`DecklistType`);
var EnumDecklistType;

(function (EnumDecklistType) {
  EnumDecklistType["mtgo"] = "mtgo";
  EnumDecklistType["mtga"] = "mtga";
  EnumDecklistType["mtgify"] = "mtgify";
})(EnumDecklistType || (EnumDecklistType = {}));

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
class Decklist extends AbstractDeck {
  constructor(rawInput, logError = true) {
    super();

    _defineProperty(this, SymDecklistType, "mtga");

    let splitData = lineSplit(rawInput.toString().trim());
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

        let card = this._newCardModel(line);

        switch (currentSection) {
          case 1:
            this.commander = card;
            break;

          case 2:
            this.companion = card;
            break;

          case 3:
            this.deck.push(card);
            break;

          case 4:
            this.sideboard.push(card);
            break;
        }

        this.valid = true;
      });
    } catch (error) {
      this.valid = false;

      if (logError) {
        console.error(error);
      }
    }
  }

  _newCardModel(rawInput, amount) {
    return super._newCardModel(rawInput, amount);
  }

}

const _commanderAnnotation = '16777728';
class MTGO extends AbstractDeck {
  constructor(xml, logError = true) {
    super();

    _defineProperty(this, SymDecklistType, "mtgo");

    xml = xml.toString().trim();
    const output = validate(xml);
    this.valid = output === true;

    if (this.valid) {
      const parsed = parse(xml, {
        attributeNamePrefix: '',
        ignoreAttributes: false
      });
      parsed.Deck.Cards.forEach(card => {
        let cm = this._newCardModel(card);

        if (card.Annotation === _commanderAnnotation) {
          this.commander = cm;
        } else if (card.Sideboard === 'true') {
          this.sideboard.push(cm);
        } else {
          this.deck.push(cm);
        }
      });
    } else if (logError) {
      console.error(output.err);
    }
  }

  _newCardModel(rawInput, amount) {
    return super._newCardModel(rawInput, amount);
  }

}

class MtgifyDecklist extends AbstractDeck {
  constructor(rawInput, logError = true) {
    super();

    _defineProperty(this, SymDecklistType, "mtgify");

    let splitData = lineSplit(rawInput.toString().trim());

    try {
      splitData.forEach(line => {
        var _m$;

        line = line.trim();

        let _m = line.match(/^(\d+)x\s+(.+)$/);

        if (_m !== null && _m !== void 0 && (_m$ = _m[1]) !== null && _m$ !== void 0 && _m$.length) {
          this.deck.push(this._newCardModel(line));
        }
      });
      this.valid = this.deck.length > 0;
    } catch (error) {
      this.valid = false;

      if (logError) {
        console.error(error);
      }
    }
  }

  _newCardModel(rawInput, amount) {
    return super._newCardModel(rawInput, amount);
  }

}

function autoParse(rawInput) {
  let deck = new MTGO(rawInput, false);

  if (deck.valid) {
    return deck;
  }

  deck = new Decklist(rawInput, false);

  if (deck.valid) {
    return deck;
  }

  let deck3 = new MtgifyDecklist(rawInput);

  if (deck3.valid) {
    return deck3;
  }

  return deck;
}

export { AbstractDeck, CardModel, Decklist, MTGO, MtgifyDecklist, SymDecklistType, autoParse, autoParse as default, parseString, toCardString, toCardStringWithoutAmount, toDeckListString, toMtgifyCardString };
//# sourceMappingURL=index.esm.js.map
