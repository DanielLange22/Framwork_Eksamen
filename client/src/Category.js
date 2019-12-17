import React, {Component} from 'react';
import { Link } from "@reach/router";
import PostCategory from "./PostCategory";

export default class Category extends Component {

    render() {
        if (!this.props.category) return <p>Loading...</p>;

        let trList = this.props.category.map(elm =>
            <li key={elm._id}><Link className="list-item" to={"/category/" + elm._id}>{elm.text}</Link>
                {this.props.admin ? <button className="button is-small" onClick={
                    () => this.props.handleDelete(elm._id)}>Delete
                </button>: []}
            </li>
        );

        let linkTo  = this.props.loggedin === "" ? "/login": "/post_a_book_for_sale";

        //ADMIN VIEW - TODO FIX FRA onAskQuestion
        let postNewQuestion = this.props.admin === true ? <div className="container">
            <PostCategory onPostCategory={this.props.onPostCategory}/>
        </div> : [];

        return (
            <div className="container">
                <h2 className="title is-4">Questions</h2>

                <ul className="has-background-white-bis">
                    {trList}
                </ul>

                <Link to={linkTo}>Post a book for sale</Link>
                {postNewQuestion}
            </div>
        )
    };
}