function getCards() {
    return (
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/shuffle/"),
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/draw/?count=52")
            .then(handleErrors)
            .then(res => {
                return res.json();
            })
            .then(data => {
                // Split deck into two piles for player and bot
                let playerDeck = data.cards.slice(0, 26);
                let botDeck = data.cards.slice(26, 52);

                // Make string with player cards code for fetch API
                let playerCardsArray = [];
                playerDeck.map(card => {
                    return playerCardsArray.push(card.code);
                });
                let playersCardsString = playerCardsArray.join(",");

                // Same for bot cards
                let botCardsArray = [];
                botDeck.map(card => {
                    return botCardsArray.push(card.code);
                });
                let botsCardsString = botCardsArray.join(",");

                // Create =Adding to player pile
                fetch(
                    "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/add/?cards=" +
                        playersCardsString
                )
                    .then(handleErrors)
                    .then(results => {
                        return results.json();
                    })
                    .then(data => {
                        return data;
                    });

                // Create Adding to bot pile
                fetch(
                    "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/add/?cards=" +
                        botsCardsString
                )
                    .then(handleErrors)
                    .then(results => {
                        return results.json();
                    })
                    .then(data => {
                        return data;
                    });
            })
    );
}

function drawPiles() {
    return Promise.all([
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/draw/?count=1"
        ),
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/draw/?count=1"
        ),
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/list/"
        ),
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/list/"
        )
    ])
        .then(([res1, res2, res3, res4]) => {
            return Promise.all([
                res1.json(),
                res2.json(),
                res3.json(),
                res4.json()
            ]);
        })
        .then(([data1, data2, data3, data4]) => {
            //On passe dans le json le nom de la pile
            data1.cards[0].namePile = "Votre carte";
            data2.cards[0].namePile = "Carte du bot";

            // On passe dans le json le nombre de cartes qu'il lui reste
            data1.cards[0].reminingCards =
                "Il vous reste " + data3.piles.playerPile.remaining + " cartes";
            data2.cards[0].reminingCards =
                "Il reste " + data4.piles.botPile.remaining + " cartes au bot";

            // Tab of cards in order to check who wins
            let orderCards = [
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                "J",
                "Q",
                "K",
                "A"
            ];

            // First letter or number of the code of the actual card of the bot and the player to compare with the tab
            let actualCardPlayer = data1.cards[0].code.charAt(0);
            let actualCardBot = data2.cards[0].code.charAt(0);

            // Index in the tab of cards of the actual card of the bot and the player
            let indexOfActualCardPlayer = orderCards.indexOf(
                actualCardPlayer,
                0
            );
            let indexOfActualCardBot = orderCards.indexOf(actualCardBot, 0);

            // String of cards to add to the pile of the winner
            let cardToWinner = data1.cards[0].code + "," + data2.cards[0].code;

            // Compare the index of the player card with the bot card, if the index is higher it wins and add the two cards to the winner

            if (data1.cards !== "undefined" && data2.cards !== "undefined") {
                if (indexOfActualCardPlayer > indexOfActualCardBot) {
                    fetch(
                        "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/add/?cards=" +
                            cardToWinner
                    );
                    data1.cards[0].status =
                        "Vous gagnez le tour et récupérez les deux cartes";
                } else if (indexOfActualCardBot > indexOfActualCardPlayer) {
                    fetch(
                        "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/add/?cards=" +
                            cardToWinner
                    );
                    data2.cards[0].status =
                        "Le bot gagne le tour et récupère les deux cartes";
                } else {
                    data1.cards[0].status =
                        "Egalité pour ce tour, les deux cartes sortent du jeu";
                }
            } else {
                alert("Fin du jeu");
            }

            return [data1, data2];
        });
}

export function fetchCards() {
    return dispatch => {
        dispatch(fetchCardsBegin());
        getCards().catch(error => dispatch(fetchCardsFailure(error)));
    };
}

export function drawCards() {
    return dispatch => {
        dispatch(fetchCardsBegin());
        return drawPiles()
            .then(json => {
                dispatch(fetchCardsSuccess(json));
                return json;
            })
            .catch(error => dispatch(fetchCardsFailure(error)));
    };
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const FETCH_CARDS_BEGIN = "FETCH_CARDS_BEGIN";
export const FETCH_CARDS_SUCCESS = "FETCH_CARDS_SUCCESS";
export const FETCH_CARDS_FAILURE = "FETCH_CARDS_FAILURE";

export const fetchCardsBegin = () => ({
    type: FETCH_CARDS_BEGIN
});

export const fetchCardsSuccess = cards => ({
    type: FETCH_CARDS_SUCCESS,
    payload: { cards }
});

export const fetchCardsFailure = error => ({
    type: FETCH_CARDS_FAILURE,
    payload: { error }
});
