import React, {Component} from 'react';

export default class PostCategory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            category: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleInput(event) {
        event.preventDefault();
        this.props.onPostCategory(this.state.category);
        this.setState({category: ""})
    }

    onChange(event) {
        this.setState({
            category: event.target.value
        });
    }

    render() {
        return (
            <form>
                <div className="field">
                    <label className="label" htmlFor="CategoryInput">Your category</label>
                    <textarea className="textarea" onChange={this.onChange} name="category"
                           value={this.state.category}
                           placeholder="Category"
                           id="CategroyInput"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="CategoryButton">Post Category
                    </button>
                </div>
            </form>
        )
    };
}