import {readFileSync} from "fs";

type Hand = {
    cards: string;
    bid: number;
};

enum HandStrength {
    HIGH_CARD,
    PAIR,
    DOUBLE_PAIR,
    THREE,
    FULL,
    FOUR,
    FIVE,
}

export const day7 = (): void => {
    console.log("Day7");

    const input = readFileSync("input/day7.txt", "utf-8");

    const hands = input.split("\n")
        .filter(Boolean)
        .map<Hand>((line) => {
            const [cards, bid] = line.split(" ");

            return {
                cards: cards ?? "",
                bid: parseInt(bid ?? "0"),
            };
        });

    firstPart(hands);
    secondPart(hands);
};

const firstPart = (hands: Hand[]): void => {
    const result = hands.sort(({cards: firstCards}, {cards: secondCards}) => compareCards(firstCards, secondCards, false))
        .reduce((previous, {bid}, i) => previous + (i + 1) * bid, 0);

    console.log(result);
};

const secondPart = (hands: Hand[]): void => {
    const result = hands.sort(({cards: firstCards}, {cards: secondCards}) => compareCards(firstCards, secondCards, true))
        // .map(({cards, bid}) => ({
        //     cards,
        //     bid,
        //     strength: getCardsStrength(cards, true),
        // }))
        // .filter(({cards, strength}) => cards.includes("J") && strength >= HandStrength.FOUR);
        .reduce((previous, {bid}, i) => previous + (i + 1) * bid, 0);

    console.log(result);
};

const getCardsStrength = (cards: string, includeJocker: boolean): HandStrength => Object.entries(cards.split("")
    .reduce<Record<string, number>>((previous, card) => {
        previous[card] = (previous[card] ?? 0) + 1;

        return previous;
    }, {})).reduce<HandStrength>((previous, [card, value], i, self) => {
        if (includeJocker && card === "J") {
            return getBestJockerHand(self.filter((_, j) => j !== i), value);
        }

        let newStrength: HandStrength;
        switch (value) {
        case 5:
            newStrength = HandStrength.FIVE;
            break;
        case 4:
            newStrength = HandStrength.FOUR;
            break;
        case 3:
            newStrength = previous === HandStrength.PAIR ? HandStrength.FULL : HandStrength.THREE;
            break;
        case 2:
            newStrength = previous === HandStrength.PAIR ? HandStrength.DOUBLE_PAIR : previous === HandStrength.THREE ? HandStrength.FULL : HandStrength.PAIR;
            break;
        default:
            newStrength = previous;
        }

        return Math.max(previous, newStrength);
    }, HandStrength.HIGH_CARD);

const compareCards = (firstCards: string, secondCards: string, includeJocker: boolean): number => {
    const firstCardsStrength = getCardsStrength(firstCards, includeJocker);
    const secondCardsStrength = getCardsStrength(secondCards, includeJocker);

    if (firstCardsStrength < secondCardsStrength) {
        return -1;
    }

    if (firstCardsStrength > secondCardsStrength) {
        return 1;
    }

    return compareEvenCards(firstCards, secondCards, includeJocker);
};

const compareEvenCards = (firstCards: string, secondCards: string, includeJocker: boolean): number => {
    const firstCardsValues = firstCards.split("").map((value) => getCardValue(value, includeJocker));
    const secondCardsValues = secondCards.split("").map((value) => getCardValue(value, includeJocker));

    for (let i = 0; i < firstCardsValues.length; ++i) {
        const firstCard = firstCardsValues[i];
        const secondCard = secondCardsValues[i];

        if (!firstCard || !secondCard || firstCard === secondCard) {
            continue;
        }

        return firstCard < secondCard ? -1 : 1;
    }

    return -1;
};

const getCardValue = (card: string, includeJocker: boolean): number => ({
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "J": includeJocker ? 1 : 11,
    "Q": 12,
    "K": 13,
    "A": 14,
}[card] ?? 0);

const getBestJockerHand = (cards: [string, number][], jockerAmount: number): HandStrength => {
    const remainingCardsStrength = getCardsStrength(cards.map(([cardName, amount]) => cardName.repeat(amount)).join(""), false);

    switch (jockerAmount) {
    case 5:
        return HandStrength.FIVE;
    case 4:
        return HandStrength.FIVE;
    case 3:
        return remainingCardsStrength === HandStrength.PAIR ? HandStrength.FIVE : HandStrength.FOUR;
    case 2:
        switch (remainingCardsStrength) {
        case HandStrength.THREE:
            return HandStrength.FIVE;
        case HandStrength.PAIR:
            return HandStrength.FOUR;
        default:
            return HandStrength.THREE;
        }
    case 1:
        switch (remainingCardsStrength) {
        case HandStrength.FOUR:
            return HandStrength.FIVE;
        case HandStrength.THREE:
            return HandStrength.FOUR;
        case HandStrength.DOUBLE_PAIR:
            return HandStrength.FULL;
        case HandStrength.PAIR:
            return HandStrength.THREE;
        default:
            return HandStrength.PAIR;
        }
    default:
        return HandStrength.HIGH_CARD;
    }
};
