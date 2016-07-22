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
            multiProblemIndex: 0,
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
            multiProblemIndex: 0,
        });
        this.clearSubmissionState();
    }

    nextQuestion () {
        this.setState({
            currentProblemIndex: this.state.currentProblemIndex + 1,
            multiProblemIndex: 0
        });
        this.clearSubmissionState();
    }

    prevMultiQuestion () {
        this.setState({
            multiProblemIndex: this.state.multiProblemIndex - 1,
        });
        this.clearSubmissionState();
    }

    nextMultiQuestion () {
        this.setState({
            multiProblemIndex: this.state.multiProblemIndex + 1,
        });
        this.clearSubmissionState();
    }

    prevDay () {
        this.setState({
            time: this.state.time.subtract(1, 'days'),
            currentProblemIndex: 0,
            multiProblemIndex: 0,
        });
        this.clearSubmissionState();
        this.updateQuestion();
    }

    nextDay () {
        this.setState({
            time: this.state.time.add(1, 'days'),
            currentProblemIndex: 0,
            multiProblemIndex: 0,
        });
        this.clearSubmissionState();
        this.updateQuestion();
    }

    clearSubmissionState () {
        this.setState({
            selectedChoice: null,
            submittedChoice: null,
            seeExplanation: false,
            currentProblemSubmitted: false,
        })
    }

    renderHeader() {
        return (
            <div className="qotd-header">
                <h2>
                    <div>Question of the Day</div>
                    <div>{this.state.time.format("MMMM Do YYYY")}</div>
                </h2>
                {this.renderQuestionSelector()}
            </div>
        )
    }

    renderProblem () {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        if (currentProblem.type == "multi") {
            return (
                <div className="qotd-multi">
                    <table><tbody><tr>
                        <td>
                            <div className="qotd-multiproblem">
                                <div className="qotd-big">
                                    Background
                                </div>
                                {currentProblem.background.split('\\n').join('\n').split('\\t').join('\t')}
                            </div>
                        </td>
                        <td>
                            <div className="qotd-multiproblem">
                                {this.renderMultiSelector()}
                                {this.renderQuestion()}
                                {this.renderChoicesAndSubmitButton()}
                                {this.renderExplanation()}
                            </div>
                        </td>
                    </tr></tbody></table>
                </div>
            )
        }
        return (
            <div className="qotd-problem">
                {this.renderQuestion()}
                {this.renderChoicesAndSubmitButton()}
                {this.renderExplanation()}
            </div>
        )
    }

    renderQuestionSelector () {
        var questionSelector;
        var multiQuestionSelector;
        if (this.state.problems.length > 1) {
            questionSelector = (
                <span>
                    {this.state.currentProblemIndex > 0 ?
                        <FontAwesome
                            className="fa--spacing-right"
                            name="arrow-circle-left"
                            onClick={this.prevQuestion.bind(this)}
                        />
                        :
                        null
                    }
                    Question {this.state.currentProblemIndex + 1} of {this.state.problems.length}
                    {this.state.currentProblemIndex < this.state.problems.length - 1 ?
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
            </div>
        )

    }

    renderMultiSelector() {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        if (currentProblem.type == "multi") {
            return (
                <div className="qotd-multiselector">
                    {this.state.multiProblemIndex > 0 ?
                        <FontAwesome
                            className="fa--spacing-right"
                            name="arrow-circle-left"
                            onClick={this.prevMultiQuestion.bind(this)}
                        />
                        :
                        null
                    }
                    Part {this.state.multiProblemIndex + 1} of {currentProblem.questions.length}
                    {this.state.multiProblemIndex < currentProblem.questions.length - 1 ?
                        <FontAwesome
                            className="fa--spacing-left"
                            name="arrow-circle-right"
                            onClick={this.nextMultiQuestion.bind(this)}
                        />
                        :
                        null
                    }
                </div>
            )
        }
    }
    renderQuestion() {
        var currentProblem = this.state.problems[this.state.currentProblemIndex];
        var currentQuestion;
        if (currentProblem.type == "multi") {
            currentQuestion = currentProblem.questions[this.state.multiProblemIndex].question;
        } else {
            currentQuestion = currentProblem.question;
        }
        return (
            <div>
                <div className="qotd-text">
                    {currentQuestion}
                </div>
            </div>
        )
    }

    renderSubmission() {
        if (this.state.currentProblemSubmitted) {
            var currentProblem = this.state.problems[this.state.currentProblemIndex];
            if (currentProblem.type == "multi") {
                var currentProblem = currentProblem.questions[this.state.multiProblemIndex];
            }
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
        if (currentProblem.type == "multi") {
            var currentProblem = currentProblem.questions[this.state.multiProblemIndex];
        }
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
            if (currentProblem.type == "multi") {
                currentProblem = currentProblem.questions[this.state.multiProblemIndex];
            }
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

