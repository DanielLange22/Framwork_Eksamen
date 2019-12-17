import React, {Component} from 'react';
import {Link} from "@reach/router";

export default class Books extends Component {

    render() {
        const category = this.props.getCategory(this.props.id);

        let answerContent = <p>loading...</p>;

        if (category) {
            answerContent = category.books ?
                category.books.map(
                    ans =>
                        <li key={ans._id}>
                            <div key={ans._id} className="columns">
                                <div className="column"><Link className="list-item" to={"/category/"+category._id +"/books/"+ans._id}>{ans.title}</Link></div>
                                <div className="column is-one-fifth">
                                    {this.props.admin ? <button className="button is-small" onClick={
                                        () => this.props.onDeleteBook(category._id, ans._id)}>Delete
                                    </button> : []}
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
                    {category ? <h3>{category.text}</h3> : <p>"loading text..."</p>}
                </section>

                <section className="section has-background-white-bis">
                    <ul>
                        {answerContent}
                    </ul>
                </section>

                </div>
            </>
        )
    };
}