import React, {Component} from 'react';
import { Link } from "@reach/router";
import AskQuestion from "./AskQuestion";

export default class Questions extends Component {

    render() {
        if (!this.props.questions) return <p>Loading...</p>;

        let trList = this.props.questions.map(elm =>
            <li key={elm._id}><Link className="list-item" to={"/question/" + elm._id}>{elm.text}</Link>
                <button className="button is-small" onClick={
                    () => this.props.handleDelete(elm._id)}>Delete
                </button>
            </li>
        );

        return (
            <div className="container">
                <h2 className="title is-4">Questions</h2>

                <ul className="has-background-white-bis">
                    {trList}
                </ul>
                <div className="container">
                    <AskQuestion onAskQuestion={this.props.onAskQuestion}/>
                </div>
            </div>
        )
    };
}