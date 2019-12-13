import React, {Component} from 'react';

export default class AskQuestion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            question: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleInput(event) {
        event.preventDefault();
        this.props.onAskQuestion(this.state.question);
        this.setState({question: ""})
    }

    onChange(event) {
        this.setState({
            question: event.target.value
        });
    }

    render() {
        return (
            <form>

                <div className="field">
                    <label className="label" htmlFor="QuestionInput">Your question</label>
                    <textarea className="textarea" onChange={this.onChange} name="question"
                           value={this.state.question}
                           placeholder="Question"
                           id="QuestionInput"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="QuestionButton">Ask Question
                    </button>
                </div>
            </form>
        )
    };
}