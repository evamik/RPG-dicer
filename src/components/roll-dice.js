import React, { Component }  from 'react';
import io from 'socket.io-client'

export default class RollDice extends Component {

    constructor(props) {
        super(props)

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeRollCount = this.onChangeRollCount.bind(this);
        this.onChangeRollSize = this.onChangeRollSize.bind(this);
        this.onChangeRollBonus = this.onChangeRollBonus.bind(this);
        this.onChangeResult = this.onChangeResult.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeOwnDice = this.onChangeOwnDice.bind(this);

        this.state = {
            username: '',
            description: '',
            rollCount: 1,
            rollSize: 20,
            rollResult: 0,
            rollBonus: 0,
            date: new Date(),
            R: 0,
            G: 0,
            B: 0,
            ownDice: false
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

    onChangeRollBonus(e){
        this.setState({
            rollBonus: e.target.value
        })
    }

    onChangeResult(e){
        this.setState({
            rollResult: e.target.value
        })
    }

    onChangeOwnDice(e){
        this.setState({
            ownDice: e.target.checked
        })
    }

    onSubmit(size) {
        if(this.state.username.length === 0)
            return

        let result = 0;

        for(var i = 0; i < this.state.rollCount; i++) {
            result += Math.round( 1 + Math.random() * (size-1));
        }
        result += Math.round(this.state.rollBonus)

        console.log(this.state.ownDice)

        if(this.state.ownDice === true)
            result = this.state.rollResult

        const roll = {
            username: this.state.username,
            description: this.state.description,
            rollCount: this.state.rollCount,
            rollSize: size,
            rollResult: result,
            rollBonus: this.state.rollBonus,
            date: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
            R: this.state.R,
            G: this.state.G,
            B: this.state.B,
            ownDice: this.state.ownDice
        }

        this.socket.emit('roll', roll)
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
                <div className="row flex-wrap align-items-end">
                    <div className="px-2" style={{width: 250}}>
                        <label className="mb-0">Player: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="px-2" style={{width: 400}}>
                        <label className="mb-0">Rolling for: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                </div>
                <div className="row flex-wrap align-items-end">
                    <div className="pl-2" style={{width: 75}}>
                        <label className="mb-0">count:</label>
                        <input type="number"
                            required
                            className="form-control"
                            value={this.state.rollCount}
                            onChange={this.onChangeRollCount}
                        />
                    </div>
                    <div className="mb-1 pr-3">d</div>
                    <div className="mb-1">+</div>
                    <div className="" style={{width: 90}}>
                        <label className="mb-0">bonus:</label>
                        <input type="number"
                            required
                            className="form-control"
                            value={this.state.rollBonus}
                            onChange={this.onChangeRollBonus}
                        />
                    </div>
                    <div className="ml-5" style={{width: 150}}>
                        <label className="mb-0">my own dice result:</label>
                        <input type="number"
                            className="form-control"
                            value={this.state.rollResult}
                            onChange={this.onChangeResult}
                        />
                    </div>
                    <div className="ml-2">
                        <input type="checkbox" value={this.state.ownDice} 
                        onChange={this.onChangeOwnDice}/>
                        <label className="pl-1">use my dice result</label>
                    </div>
                </div>
                <div className="row align-items-end p-2">
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(4)} 
                        className="btn btn-primary">d4</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(6)} 
                        className="btn btn-primary">d6</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(8)} 
                        className="btn btn-primary">d8</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(10)} 
                        className="btn btn-primary">d10</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(12)} 
                        className="btn btn-primary">d12</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(20)} 
                        className="btn btn-primary">d20</button>
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(100)} 
                        className="btn btn-primary">d100</button>
                    </div>
                </div>
                <div className="row align-items-end px-2">
                    <div className="pr-2" style={{width: 100}}>
                        <label className="mb-0">custom size:</label>
                        <input type="number"
                            required
                            className="form-control"
                            value={this.state.rollSize}
                            onChange={this.onChangeRollSize}
                        />
                    </div>
                    <div className="pr-2">
                        <button onClick={() => this.onSubmit(this.state.rollSize)} 
                        className="btn btn-primary">submit</button>
                    </div>
                </div>
            </div>
        )
    }
}