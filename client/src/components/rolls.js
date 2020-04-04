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
                <td>
                    <Popup trigger={<button 
                        onClick={() => {this.props.onPopup(this.props.roll.rolls)}} 
                        className="btn btn-sm btn-info">{this.props.roll.result}
                    </button>}
                    modal closeOnDocumentClick>
                        <div className="bg-dark text-white">
                            <h3>Roll details</h3>
                            <table className="table table table-sm table-dark">
                            <thead className="thead-dark">
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
                    </Popup>
                </td>
                <td>{this.props.roll.description}</td>
                <td>
                    <button className="btn btn-sm py-0 px-1 btn-danger"
                            onClick={(() => this.props.onRemoveEvent(this.props.roll))}>X</button>
                </td>
            </tr>
        )
    }
}

class Rolls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rolls: [],
            inits: [],
            resetDate: '2020-01-01'
        };

        this.handleReset = this.handleReset.bind(this)
    }

    componentDidMount(){
        this.socket = io();

        this.socket.on('init', (rll) => {
            this.setState((state) => ({
                rolls: rll
            }))
        })

        this.socket.on('initiative', data => {
            this.setState((state) => ({
                inits: data.rolls
                    .sort((a, b) => b.result - a.result),
                resetDate: data.date
            }))
        })

        this.socket.on('removeAndAdd', (rll) => {
            let rolls = [rll[1], ...this.state.rolls
                .filter(r => r._id !== rll[0]._id)]
            let inits = [...this.state.inits
                .filter(r => r._id !== rll[0]._id)]
                .sort((a, b) => b.result - a.result)
            if(rll[1] === "")
                rolls = [...rolls.slice(1)]
            this.setState((state) => ({
                rolls: rolls,
                inits: inits
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
            if(rll.description === "init"){
                    this.setState((state) => ({
                        inits: [...state.inits, rll].sort((a, b) => b.result - a.result)
                    }));
            }
          });
    }

    handleRemoveEvent = (roll) => {
        this.socket.emit('removeRoll', roll)
    }

    initiativeList(){
        return this.state.inits.map((currentroll, index) => {
            return <RollContainer roll={currentroll} key={index} onRemoveEvent={this.handleRemoveEvent}/>
        })
    }

    handleReset() {
        this.socket.emit('resetInitiative', new Date())
    }

    rollList() {
        return this.state.rolls.map((currentroll, index) => {
            return <RollContainer roll={currentroll} key={index} onRemoveEvent={this.handleRemoveEvent}/>
        })
    }

    render() {
        return (
            <div className="row">
                <div style={{width: 600}}>
                    <h3>Rolls log</h3>
                    <table className="table table-dark table-sm">
                        <thead className="thead-dark">
                            <tr>
                            <th style={{width:90}}></th>
                            <th>Username</th>
                            <th style={{width:60}}>rolled</th>
                            <th>rolled for</th>
                            <th style={{width:28}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.rollList() } 
                        </tbody>
                    </table>
                </div>
                <div style={{marginLeft:80}}>
                    <div className="row align-items-end">
                        <h3>Initiative rolls</h3>
                        <a className="ml-1 mb-2">(Rolling for: init)</a>
                        <button className="ml-2 btn btn-sm my-2 py-0 btn-warning"
                                onClick={this.handleReset}>reset</button>
                        <h6 className="pl-2 mt-2" style={{color:"#5b6671"}}>last reset: {this.state.resetDate}</h6>
                    </div>
                    <table className="table table-dark table-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th></th>
                                <th>Username</th>
                                <th>rolled</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.initiativeList() }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Rolls;