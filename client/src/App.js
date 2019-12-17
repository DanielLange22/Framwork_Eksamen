import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from "react-redux";

import Category from "./Category";
import Books from "./Books";
import Login from "./Login";
import Alert from "./Alert";
import UserHeader from "./UserHeader";
import io from 'socket.io-client'

import {
    login,
    logout,
    loadCategory,
    hideAlert,
    createLogin, updateLogin, postCategory, deleteCategory, postBook, deleteBook
} from './actions';
import CreateLogin from "./CreateLogin";
import UpdatePassword from "./UpdatePassword";
import PostANewBook from "./PostANewBook";
import Book from "./Book";

const Socket = process.env.Socket;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: ""
        };
    }

    //Socket = process.env.REACT_APP_API_URL;
    async componentDidMount() {
        this.props.loadCategory();

        const socket = io(`${this.props.Socket}/Socket`)
        await socket.on('connect', () => {
            console.log ("Connected to socket.io! HALLO!?");
        });
        socket.on('new-data-category-list', (data) => {
            console.log("Data from server: " + data);
            this.props.loadCategory();
        })
    }

    resetAlert() {
        this.setState({
            alertMsg: "",
            suppressInfo: true
        })
    }

    render() {
        let notification = <></>;
        if (this.props.notifications.active) {
            const notif = this.props.notifications;
            const level = notif.level === "error" ? "is-danger" : "is-warning";

            notification = <section className={`hero ${level} is-small`}>
                <div className="hero-body">
                    <div className="container">
                        <button onClick={() => this.props.hideAlert()} className="delete is-large is-pulled-right" />
                        <h1 className="title">
                            {notif.title}
                        </h1>
                        <h2 className="subtitle">
                            {notif.text}
                        </h2>
                    </div>
                </div>
            </section>
        }

        return (
            <>
                {notification}

                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <Link to="/"><h1 className="title is-2">Category's and Books</h1></Link>
                            <h2 className="subtitle">
                                Get help here!
                            </h2>
                            <Link to="/createLogin"><h3 className="title is-2">Create Login</h3></Link>
                            <Link to="/updateLogin"><h3 className="title is-2">Update login</h3></Link>
                        </div>
                    </div>
                </section>

                <UserHeader username={this.props.user.username} logout={_ => this.props.logout()}/>

                <section className="section">
                    <Alert msg={this.state.alertMsg}/>

                    <Router>
                        <Category path="/"
                            category={this.props.category}
                            onPostCategory={(text) => this.props.postCategory(text)}
                            handleDelete={(id) => this.props.deleteCategory(id)}
                            admin={this.props.user.admin}
                            loggedin={this.props.user.username}
                            //admin={true}
                        />

                        <Books path="/category/:id"
                            getCategory={(id) => this.props.category.find(e => e._id === id)}
                            admin={this.props.user.admin}
                            onDeleteBook={(id, id_answer) => this.props.deleteBook(id, id_answer)}
                            //onPostAnswer={(category_id, title, author, category, price, name_seller, email_seller) => this.props.postBook(category_id, title, author, category, price, name_seller, email_seller)}
                        />

                        <PostANewBook path="/post_a_book_for_sale"
                               category={this.props.category}
                               infoMsg={this.state.infoMsg}
                               onPostAnswer={(category_id, title, author, category, price, name_seller, email_seller) => this.props.postBook(category_id, title, author, category, price, name_seller, email_seller)}
                        />

                        <Book path="/category/:id_cat/books/:id_book"
                              getBook={(id_cat, id_book) => this.props.category.find(e => e._id === id_cat).books.find(x => x._id === id_book) }
                        />

                        <Login path="/login"
                            login={(username, password) => this.props.login(username, password)}
                            infoMsg={this.state.infoMsg}
                        />

                        <CreateLogin path="/createLogin"
                                createLogin={(username, password, admin) => this.props.createLogin(username, password, admin)}
                        />

                        <UpdatePassword path="/updateLogin"
                                updatepassword={(username, password) => this.props.updatePassword(username, password)}
                        />

                    </Router>

                </section>

                <footer className="footer">
                    <div className="container">
                        <div className="content has-text-centered">
                            <p>
                                <strong>Sale Site</strong> by Daniel
                            </p>
                        </div>
                    </div>
                </footer>
            </>
        );
    }
}

const mapStateToProps = state => ({
    category: state.category,
    user: state.user,
    notifications: state.notifications,
    Socket: process.env.REACT_APP_API_URL
});

const mapDispatchToProps = dispatch => ({
    loadCategory: _ => dispatch(loadCategory()),
    postCategory: text => dispatch(postCategory(text)),
    deleteCategory: (id) => dispatch(deleteCategory(id)),
    postBook: (category_id, title, author, category, price, name_seller, email_seller) => dispatch(postBook(category_id, title, author, category, price, name_seller, email_seller)),
    deleteBook: (id, answer_id) => dispatch(deleteBook(id, answer_id)),
    login: (username, password) => dispatch(login(username, password)),
    logout: _ => dispatch(logout()),
    createLogin: (username, password, admin) => dispatch(createLogin(username, password, admin)),
    updatePassword: (username, password) => dispatch(updateLogin(username, password)),
    hideAlert: _ => dispatch(hideAlert())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

