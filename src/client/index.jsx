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
            seeExplanation: false,
            time: moment()
        };
        this.state = this.initialState;
    }

    componentDidMount () {
        this.updateQuestion();
    }

    updateQuestion () {
        fetch('/qotd?date=' + this.state.time.format('M-D-YY')).then(this.checkStatus).then(this.getJson).then(this.handleProblems.bind(this));
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

    prevQuestion () {
        this.setState({
            currentProblemIndex: this.state.currentProblemIndex - 1,
        })
        this.clearSubmissionState();
    }

    nextQuestion () {
        this.setState({
            currentProblemIndex: this.state.currentProblemIndex + 1
        })
        this.clearSubmissionState();
    }

    prevDay () {
        this.setState({
            time: this.state.time.subtract(1, 'days')
        })
        this.clearSubmissionState();
        this.updateQuestion();
    }

    nextDay () {
        this.setState({
            time: this.state.time.add(1, 'days')
        })
        this.clearSubmissionState();
        this.updateQuestion();
    }

    clearSubmissionState () {
        this.setState({
            selectedChoice: null,
            submittedChoice: null,
            seeExplanation: false,
            currentProblemSubmitted: false  
        })
    }

    renderHeader() {
        return (
            <div className="qotd-header">
                <h2>
                    <div>Question of the Day</div>
                    <div>{this.state.time.format("MMMM Do YYYY")}</div>
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

    renderQuestionSelector() {
        <FontAwesome
            className="fa--spacing-right"
            name="angle-double-left"
            onClick={this.prevDay.bind(this)}
        />
        var questionSelector;
        if (this.state.problems.length > 1) {
            questionSelector = (
                <span>
                    {this.state.problems.length > 1 && this.state.currentProblemIndex > 0 ?
                        <FontAwesome
                            className="fa--spacing-right"
                            name="arrow-circle-left"
                            onClick={this.prevQuestion.bind(this)}
                        />
                        :
                        null
                    }
                    Question {this.state.currentProblemIndex + 1} of {this.state.problems.length}
                    {this.state.problems.length > 1 && this.state.currentProblemIndex < this.state.problems.length - 1 ?
                        <FontAwesome
                            className="fa--spacing-left"
                            name="arrow-circle-right"
                            onClick={this.nextQuestion.bind(this)}
                        />
                        :
                        null
                    }
                </span>
            )
        }
        return (
            <div>
                <FontAwesome
                    className="fa--spacing-dbl-right"
                    name="angle-double-left"
                    onClick={this.prevDay.bind(this)}
                />
                {questionSelector}
                <FontAwesome
                    className="fa--spacing-dbl-left"
                    name="angle-double-right"
                    onClick={this.nextDay.bind(this)}
                />
            </div>
        )

    }

    renderQuestion() {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        return (
            <div className="qotd-text">
                {this.renderQuestionSelector()}
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
                            className="fa--centered fa--green fa--spacing-right"
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
                        className="fa--centered fa--red fa--spacing-right"
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

