import React from "react";

let playerPile = "";
let botPile = "";

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
                    playerCardsArray.push(card.code);
                });
                let playersCardsString = playerCardsArray.join(",");

                // Same for bot cards
                let botCardsArray = [];
                botDeck.map(card => {
                    botCardsArray.push(card.code);
                });
                let botsCardsString = botCardsArray.join(",");

                // Create Adding to player pile
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

                // Listing player pile
                fetch(
                    "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/list/"
                )
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
    // return fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/draw/?count=1"),
    //     fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/draw/?count=1")
    //         .then(results => {
    //             return results.json();
    //         })
    //         .then(data => {
    //             console.log("data :", data);
    //             return data;
    //         });
    return Promise.all([
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/draw/?count=1"
        ),
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/draw/?count=1"
        )
    ])
        .then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()]);
        })
        .then(([data1, data2]) => {
            data1.cards[0].namePile = "Carte du joueur";
            data2.cards[0].namePile = "Carte du bot";
            console.log(data1);
            console.log(data2);
            return [data1, data2];
        });
}

export function fetchCards() {
    return dispatch => {
        dispatch(fetchCardsBegin());
        getCards();
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
