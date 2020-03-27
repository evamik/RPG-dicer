import React, { Component } from 'react';
import Axios from 'axios';
import io from 'socket.io-client'

const Roll = props => (
    <tr>
        <td><a style={{color: `rgb(${props.roll.R}, ${props.roll.G}, ${props.roll.B})`}}>llll </a>{props.roll.date}</td>
        <td>{props.roll.username}</td>
        <td>{`${props.roll.rollCount}d${props.roll.rollSize}+${props.roll.rollBonus} ${props.roll.ownDice ? '(own dice)' : ''}`}</td>
        <td>{props.roll.rollResult}</td>
        <td>{props.roll.description}</td>
    </tr>
)

class Rolls extends Component {
    constructor(props) {
        super(props);

        this.state = {rolls: []};
    }

    componentDidMount(){
        this.socket = io(`${window.location.hostname}:5000`);

        this.socket.on('init', (rll) => {
            this.setState((state) => ({
                rolls: [...state.rolls, ...rll]
            }))
        })

        this.socket.on('push', (rll) => {
            this.setState((state) => ({
                rolls: [...state.rolls.slice(1), rll]
            }));
          });
    }

    rollList() {
        return this.state.rolls.map(currentroll => {
            return <Roll roll={currentroll} key={currentroll._id}/>
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
                    <th>roll type</th>
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