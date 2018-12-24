import React from "react";
import { connect } from "react-redux";
import { fetchCards } from "./cardActions";

class CardList extends React.Component {
    constructor(props) {
        super(props);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(fetchCards());
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const { dispatch } = this.props;
        dispatch(fetchCards());
    }

    render() {
        const { error, loading, cards } = this.props;

        if (error) {
            return <div>Error! {error.message}</div>;
        }

        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div class="container">
                <h1>Bataille</h1>

                {cards.map((card, index) => (
                    <div class="card" key={index}>
                        <h2 key={index}>{card.cards[0].namePile}</h2>
                        <img src={card.cards[0].images.png} alt="card" />
                    </div>
                ))}

                <div class="myButton">
                    <button onClick={this.handleRefreshClick}>
                        Prochain tour
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    cards: state.cards.items,
    loading: state.cards.loading,
    error: state.cards.error
});

export default connect(mapStateToProps)(CardList);
