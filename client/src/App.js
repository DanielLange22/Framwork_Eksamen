import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from "react-redux";

import Questions from "./Questions";
import Question from "./Question";
import Login from "./Login";
import Alert from "./Alert";
import UserHeader from "./UserHeader";
import io from 'socket.io-client'

import {
    login,
    logout,
    loadQuestions,
    postQuestion,
    postAnswer,
    voteAnswerUp,
    hideAlert,
    voteAnswerDown,
    createLogin, updateLogin, deleteQuestion, deleteAnswer
} from './actions';
import CreateLogin from "./CreateLogin";
import UpdatePassword from "./UpdatePassword";



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
        this.props.loadQuestions();

        const socket = io(`${this.props.Socket}/Socket`)
        await socket.on('connect', () => {
            console.log ("Connected to socket.io! HALLO!?");
            socket.emit (' hello', " Kristian", "lal");
        });
        socket.on('new-data-question-list', (data) => {
            console.log("Data from server: " + data);
            this.props.loadQuestions();
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
                            <Link to="/"><h1 className="title is-2">Questions and Answers</h1></Link>
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
                        <Questions path="/"
                            questions={this.props.questions}
                            onAskQuestion={(text) => this.props.postQuestion(text)}
                            handleDelete={(id) => this.props.deleteQuestion(id)}
                        />

                        <Question path="/question/:id"
                            getQuestion={(id) => this.props.questions.find(e => e._id === id)}
                            handleVote={(id, aid) => this.props.voteAnswerUp(id, aid)}
                            handleVoteDown={(id, aid) => this.props.voteAnswerDown(id, aid)}
                            onDeleteAnswer={(id, id_answer) => this.props.deleteAnswer(id, id_answer)}
                            onPostAnswer={(id, text) => this.props.postAnswer(id, text)}
                        />

                        <Login path="/login"
                            login={(username, password) => this.props.login(username, password)}
                            infoMsg={this.state.infoMsg}
                        />

                        <CreateLogin path="/createLogin"
                                createLogin={(username, password) => this.props.createLogin(username, password)}
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
                                <strong>QA Site</strong> by Kristian
                            </p>
                        </div>
                    </div>
                </footer>
            </>
        );
    }
}

const mapStateToProps = state => ({
    questions: state.questions,
    user: state.user,
    notifications: state.notifications,
    Socket: process.env.REACT_APP_API_URL
});

const mapDispatchToProps = dispatch => ({
    loadQuestions: _ => dispatch(loadQuestions()),
    postQuestion: text => dispatch(postQuestion(text)),
    deleteQuestion: (id) => dispatch(deleteQuestion(id)),
    postAnswer: (id, text) => dispatch(postAnswer(id, text)),
    deleteAnswer: (id, answer_id) => dispatch(deleteAnswer(id, answer_id)),
    login: (username, password) => dispatch(login(username, password)),
    logout: _ => dispatch(logout()),
    createLogin: (username, password) => dispatch(createLogin(username, password)),
    updatePassword: (username, password) => dispatch(updateLogin(username, password)),
    voteAnswerUp: (questionId, answerId) => dispatch(voteAnswerUp(questionId, answerId)),
    voteAnswerDown: (questionId, answerId) => dispatch(voteAnswerDown(questionId, answerId)),
    hideAlert: _ => dispatch(hideAlert())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

