import React, {Component} from 'react';
import PostAnswer from "./PostAnswer";

export default class Question extends Component {

    render() {
        const question = this.props.getQuestion(this.props.id);

        let answerContent = <p>loading...</p>;

        if (question) {
            answerContent = question.answers ?
                question.answers.map(
                    ans =>
                        <li key={ans._id}>
                            <div key={ans._id} className="columns">
                                <div className="column">{ans.text}</div>
                                <div className="column is-one-fifth">
                                    <button className="button is-small" onClick={
                                        () => this.props.handleVote(question._id, ans._id)}>Vote Up
                                    </button>
                                    <button className="button is-small" onClick={
                                        () => this.props.handleVoteDown(question._id, ans._id)}>Vote Down
                                    </button>
                                    <button className="button is-small" onClick={
                                        () => this.props.onDeleteAnswer(question._id, ans._id)}>Delete
                                    </button>
                                    <span className="is-outlined">  {ans.votes}</span>
                                </div>

                            </div>
                        </li>
                ) : [];
        }

        return (
            <>
                <div className="container">
                <section className="section">
                    {question ? <h3>{question.text}</h3> : <p>"loading text..."</p>}
                </section>

                <section className="section has-background-white-bis">
                    <ul>
                        {answerContent}
                    </ul>
                </section>

                <section className="section">
                    <PostAnswer question={question} onPostAnswer={this.props.onPostAnswer}/>
                </section>

                </div>
            </>
        )
    };
}