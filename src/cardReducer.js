import {
    FETCH_CARDS_BEGIN,
    FETCH_CARDS_SUCCESS,
    FETCH_CARDS_FAILURE
} from "./cardActions";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export default function cardReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CARDS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_CARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.cards
            };

        case FETCH_CARDS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: []
            };

        default:
            return state;
    }
}
