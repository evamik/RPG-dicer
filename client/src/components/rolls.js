import React, { Component } from 'react';
import io from 'socket.io-client'
import Popup from 'reactjs-popup'

class Roll extends Component {
    render() {
        return(
            <tr>
                <td>{`1d${this.props.roll.rollSize} ${this.props.roll.ownDice ? '(own dice)' : ''}`}</td>
                <td>{this.props.roll.rollResult}</td>
                <td>{this.props.roll.description}</td>
            </tr>
        )
    }
}

class RollContainer extends Component {
    rollList() {
        return this.props.roll.rolls.map((currentroll, index) => {
            return <Roll onPopup={this.openPopup} roll={currentroll} key={index}/>
        })
    }

    render() {
        return(
            <tr>
                <td><a style={{color: `rgb(${this.props.roll.R}, ${this.props.roll.G}, ${this.props.roll.B})`}}>llll </a>{this.props.roll.date}</td>
                <td>{this.props.roll.username}</td>
                <td><Popup trigger={<button 
                    onClick={() => {this.props.onPopup(this.props.roll.rolls)}} 
                    className="btn btn-info">{this.props.roll.result}
                </button>}
                modal closeOnDocumentClick>
                    <div>
                        <h3>Rolls log</h3>
                        <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>roll type</th>
                                <th>rolled</th>
                                <th>rolled for</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.rollList() } 
                        </tbody>
                        </table>
                        bonus: +{this.props.roll.bonus}
                    </div>
                </Popup></td>
                <td>{this.props.roll.description}</td>
            </tr>
        )
    }
}

class Rolls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rolls: [],
        };
    }

    componentDidMount(){
        this.socket = io();

        this.socket.on('init', (rll) => {
            this.setState((state) => ({
                rolls: [...state.rolls, ...rll]
            }))
        })

        this.socket.on('push', (rll) => {
            if(this.state.rolls.length === 10)
                this.setState((state) => ({
                    rolls: [...state.rolls.slice(1), rll]
                }));
            else 
                this.setState((state) => ({
                    rolls: [...state.rolls, rll]
                }));
          });
    }

    rollList() {
        return this.state.rolls.map(currentroll => {
            return <RollContainer roll={currentroll} key={currentroll._id}/>
        })
    }

    render() {
        return (
            <div>
                <h3>Rolls log</h3>
                <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th></th>
                    <th>Username</th>
                    <th>rolled</th>
                    <th>rolled for</th>
                    </tr>
                </thead>
                <tbody>
                    { this.rollList() } 
                </tbody>
                </table>
            </div>
        );
    }
}

export default Rolls;