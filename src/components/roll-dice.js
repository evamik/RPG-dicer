import React, { Component }  from 'react';
import axios from 'axios';
import io from 'socket.io-client'

export default class RollDice extends Component {

    constructor(props) {
        super(props)

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeRollCount = this.onChangeRollCount.bind(this);
        this.onChangeRollSize = this.onChangeRollSize.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            description: '',
            rollCount: 1,
            rollSize: 20,
            rollResult: 0,
            date: new Date(),
            R: 0,
            G: 0,
            B: 0
        }
    }

    onChangeUsername(e){
        this.setState({
            username: e.target.value
        })
    }
    
    onChangeDescription(e){
        this.setState({
            description: e.target.value
        })
    }

    onChangeRollCount(e){
        let val = e.target.value;
        if(val < 1)
            val = 1;

        this.setState({
            rollCount: val
        })
    }

    onChangeRollSize(e){
        let val = e.target.value;
        if(val < 1)
            val = 1;

        this.setState({
            rollSize: val
        })
    }

    onSubmit(e) {
        e.preventDefault();

        let result = 0;

        for(var i = 0; i < this.state.rollCount; i++) {
            result += Math.round( 1 + Math.random() * (this.state.rollSize-1));
        }

        const roll = {
            username: this.state.username,
            description: this.state.description,
            rollCount: this.state.rollCount,
            rollSize: this.state.rollSize,
            rollResult: result,
            date: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
            R: this.state.R,
            G: this.state.G,
            B: this.state.B,
        }

        this.socket.emit('roll', roll)

        console.log(roll)
        /*axios.post('http://localhost:5000/rolls/add', roll)
            .then(res => console.log(res.data));*/
    }

    componentDidMount(){
        this.socket = io(`${window.location.hostname}:5000`);

        fetch("https://api.ipify.org?format=json")
        .then(response => {
            return response.json();
        }, "jsonp")
        .then(res => {
            console.log(res.ip);
            const ip_array = res.ip.split('.')      // Returns array of the string above separated by ".". ["::ffff:192","168","0","1"]

            // The switch statement checks the value of the array above for the index of 2. This would be "0"
            this.setState({
                R: ip_array[0],
                G: ip_array[1],
                B: ip_array[3],
            })
        })
        .catch(err => console.log(err))
    }

    render () {
        return (
            <div className="">
                <h3>Roll your dice!</h3>
                <form className="row align-items-end flex-wrap" onSubmit={this.onSubmit}>
                    <div className="px-2 form-group" style={{width: 250}}>
                        <label>Player: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="px-2 form-group" style={{width: 400}}>
                        <label>Rolling for: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <div className="px-2 form-group" style={{width: 100}}>
                        <label>Roll count: </label>
                        <input type="number"
                            required
                            className="form-control"
                            value={this.state.rollCount}
                            onChange={this.onChangeRollCount}
                        />
                    </div>
                    <div className="px-2 form-group" style={{width: 90}}>
                        <label>Roll size: </label>
                        <input type="number"
                            required
                            className="form-control"
                            value={this.state.rollSize}
                            onChange={this.onChangeRollSize}
                        />
                    </div>
                    <div className="px-2 align-self-end form-group">
                        <input type="submit" value="Try your luck" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}