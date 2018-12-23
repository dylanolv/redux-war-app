import React from "react";

let playerPile = "";
let botPile = "";

function getCards() {
    return (
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/shuffle/"),
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/draw/?count=52")
            .then(handleErrors)
            .then(res => {
                return res.json()
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
                // console.log("playersCardsString :", playersCardsString);

                // Same for bot cards
                let botCardsArray = [];
                botDeck.map(card => {
                    botCardsArray.push(card.code);
                });
                let botsCardsString = botCardsArray.join(",");
                // console.log("botsCardsString :", botsCardsString);

                // Create Adding to player pile
                fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/add/?cards=" + playersCardsString)
                    .then(handleErrors)
                    .then(results => {
                        return results.json();
                    })
                    .then(data => {
                        // console.log("PLAYER DATA :", data);
                        return data;
                    })

                // Create Adding to bot pile
                fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/botPile/add/?cards=" + botsCardsString)
                    .then(handleErrors)
                    .then(results => {
                        return results.json();
                    })
                    .then(data => {
                        // console.log("BOT DATA :", data);
                        return data;
                    })

                // Listing player pile
                fetch(
                    "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/list/"
                ).then(results => {
                    return results.json();
                }).then(data => {
                    console.log("playerPile list data :", data);
                    return data;
                });
            })
    );
}

function drawPlayerPile() {
    return (
        fetch(
            "https://deckofcardsapi.com/api/deck/9td6jw4agj8o/pile/playerPile/draw/?count=1"
        ).then(results => {
            return results.json();
        }).then(data => {
            console.log("Player draw card", data);
            return data;
        })
    )
}

export function fetchCards() {
    return dispatch => {
        dispatch(fetchCardsBegin());
        getCards();
        return drawPlayerPile()
            .then(json => {
                dispatch(fetchCardsSuccess(json.cards));
                console.log("json.cards :", json.cards);
                return json.cards;
            })
            .catch(error => dispatch(fetchCardsFailure(error)));
        // return getCards()
        //     .then(json => {
        //         dispatch(fetchCardsSuccess(json.cards));
        //         return json.cards;
        //     })
        //     .catch(error => dispatch(fetchCardsFailure(error)));
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
