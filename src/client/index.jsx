import React from 'react';
import {render} from 'react-dom';
import moment from 'moment';
import {RadioGroup, Radio} from 'react-radio-group';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import './stylesheet.css';
import 'whatwg-fetch';

class App extends React.Component { 
    constructor (props) {
        super(props);
        this.initialState = {
            problems: [{
                question: "",
                choices: {
                    a: "",
                    b: "",
                    c: "",
                    d: ""
                },
                answer: "",
                explanation: ""
            }],
            currentProblemIndex: 0,
            currentProblemSubmitted: false,
            selectedChoice: null,
            submittedChoice: null,
            seeExplanation: false
        };
        this.state = this.initialState;
    }

    componentDidMount () {
        fetch('/qotd').then(this.checkStatus).then(this.getJson).then(this.handleProblems.bind(this));
    }

    checkStatus (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    getJson (response) {
        return response.json();
    }

    handleProblems (response) {
        this.setState({
            problems: response.problems
        })
    }

    onSelectChoice (selectedChoice) {
        this.setState({
            selectedChoice: selectedChoice
        });
    }

    onButtonClick () {
        this.setState({
            currentProblemSubmitted: true,
            submittedChoice: this.state.selectedChoice
        });
    }

    toggleSeeExplanation () {
        this.setState({
            seeExplanation: !this.state.seeExplanation
        });
    }

    renderHeader() {
        return (
            <div className="qotd-header">
                <h2>
                    <div>Question of the Day</div>
                    <div>{moment().format("MMMM Do YYYY")}</div>
                </h2>
            </div>
        )
    }

    renderProblem () {
        return (
            <div className="qotd-problem">
                {this.renderQuestion()}
                {this.renderChoicesAndSubmitButton()}
                {this.renderExplanation()}
            </div>
        )
    }

    renderQuestion() {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        return (
            <div className="qotd-text">
                {currentProblem.question}
            </div>
        )
    }

    renderSubmission() {
        if (this.state.currentProblemSubmitted) {
            var currentProblem = this.state.problems[this.state.currentProblemIndex];
            if(!this.state.submittedChoice) {
                return (
                    <span>Please select a response.</span>
                )
            }
            if(this.state.submittedChoice == currentProblem.answer) {
                return (
                    <span>
                        <FontAwesome
                            className="fa--centered fa--green fa--spacing"
                            name="check-circle"
                            size="2x"
                        />
                        Correct! <a href="#" onClick={this.toggleSeeExplanation.bind(this)}>Click</a> to see explanation.
                    </span>  
                )            
            }
            return (
                <span>
                    <FontAwesome
                        className="fa--centered fa--red fa--spacing"
                        name="times-circle"
                        size="2x"
                    />
                    Incorrect! <a href="#" onClick={this.toggleSeeExplanation.bind(this)}>Click</a> to see explanation.
                </span>
            )
        }
    }

    renderChoicesAndSubmitButton() {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        var choiceLetters = ["a", "b", "c", "d"];
        return (
            <div className="qotd-choices">
                <RadioGroup name="choices" selectedValue={this.state.selectedChoice} onChange={this.onSelectChoice.bind(this)}>
                    {
                        choiceLetters.map((choiceLetter) => 
                            <label className="qotd-choice" key={choiceLetter}>
                                <Radio value={choiceLetter} /> {currentProblem.choices[choiceLetter]}
                            </label>
                        )
                    }
                </RadioGroup>
                <div className="qotd-submit">
                    <Button className="qotd-submitButton" bsStyle="primary" bsSize="small" onClick={this.onButtonClick.bind(this)}>Submit</Button>
                    {this.renderSubmission()}
                </div>
            </div>
        );
    }

    renderExplanation() {
        if (this.state.seeExplanation) {
            var currentProblem = this.state.problems[this.state.currentProblemIndex];
            return (
                <div className="qotd-text">
                    {currentProblem.explanation}
                </div>
            )
        }
    }

    render () {
        return (
            <div className="qotd">
                {this.renderHeader()}
                {this.renderProblem()}
            </div>
        )
    }
}

render(<App/>, document.getElementById('content'));

