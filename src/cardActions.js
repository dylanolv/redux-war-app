function getCards() {
    return (
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/shuffle/"),
        fetch("https://deckofcardsapi.com/api/deck/9td6jw4agj8o/draw/?count=52")
            .then(handleErrors)
            .then(res => res.json())
    );
}

export function fetchCards() {
    return dispatch => {
        dispatch(fetchCardsBegin());
        return getCards()
            .then(json => {
                dispatch(fetchCardsSuccess(json.cards));
                return json.cards;
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
