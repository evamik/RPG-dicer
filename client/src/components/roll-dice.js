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
        this.onSubmitAll = this.onSubmitAll.bind(this);
        this.onChangeOwnDice = this.onChangeOwnDice.bind(this);

        this.state = {
            id: 0,
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
            ownDice: false,
            rolls: [],
            canSubmitAll: false
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
            result = Math.round(Math.random()*(size-1))+1
            if(this.state.ownDice === true)
                result = this.state.rollResult

            const roll = {
                description: this.state.description,
                rollSize: size,
                rollResult: result,
                ownDice: this.state.ownDice
            }

            this.setState((state) => ({
                rolls: [...state.rolls, roll]
            }))
            
            if(this.state.ownDice === true)
                break;
        }

        this.setState({
            canSubmitAll: true
        })
    }

    onSubmitAll(){
        var _result = 0
        for(var i = 0; i < this.state.rolls.length; i++) {
            _result += Math.round(this.state.rolls[i].rollResult)
        }
        _result += Math.round(this.state.rollBonus)

        const rollContainer = {
            username: this.state.username,
            description: this.state.description,
            date: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
            result: _result,
            bonus: this.state.rollBonus,
            R: this.state.R,
            G: this.state.G,
            B: this.state.B,
            rolls: this.state.rolls
        }

        this.setState({
            description: '',
            rollCount: 1,
            rollSize: 20,
            rollResult: 0,
            rollBonus: 0,
            ownDice: false,
            rolls: [],
            canSubmitAll: false
        })

        this.socket.emit('roll', rollContainer)
    }

    componentDidMount(){
        this.socket = io();

        fetch("https://api.ipify.org?format=json")
        .then(response => {
            return response.json();
        }, "jsonp")
        .then(res => {
            console.log(res.ip);
            const ip_array = res.ip.split('.')
            
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
                            disabled={this.state.ownDice}
                            value={this.state.rollCount}
                            onChange={this.onChangeRollCount}
                        />
                    </div>
                    <div className="mb-1 pr-3">d</div>
                    <div className="ml-5" style={{width: 150}}>
                        <label className="mb-0">my own dice result:</label>
                        <input type="number"
                            className="form-control"
                            disabled={!this.state.ownDice}
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
                <div className="row align-items-end px-2">
                    <h3 className="mr-2">dices rolled: {this.state.rolls.length}</h3>
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
                    <button onClick={() => this.onSubmitAll()} 
                        className="btn btn-primary"
                        disabled={!this.state.canSubmitAll}>submit all</button>
                </div>
            </div>
        )
    }
}