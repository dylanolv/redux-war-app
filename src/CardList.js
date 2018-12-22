import React from "react";
import { connect } from "react-redux";
import { fetchCards } from "./cardActions";

class CardList extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchCards());
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
            <div>
                {cards.map(card => (
                    <div key={card.code}>
                        <img src={card.images.png} alt="card" />
                    </div>
                ))}
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
