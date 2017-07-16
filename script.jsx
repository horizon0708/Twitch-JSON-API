// User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.

// User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.

// User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.

async function getJSON(categ, name) {
    var data = $.getJSON('https://wind-bow.gomix.me/twitch-api/' + categ + '/' + name + '?callback=?', function (data) {;
    });
    return data;
}

function isOnline(item, callback) {
    getJSON("streams", item).then((x) => {
        if (x.stream === null) {
            return callback(false);
        }
        if (x.stream === undefined) {
            return callback(false);
        }
        else {
            return callback(null, true);
        }
    });
}

function isOffline(item, callback) {
    getJSON("streams", item).then((x) => {
        if (x.stream === null) {
            return callback(null, true);
        }
        if (x.stream === undefined) {
            return callback(false);
        }
        else {
            return callback(false);
        }
    });
}

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            all: ["_ werds", "gawjasef", "OGN_LoL", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
            online: [],
            offline: [],
            showing: "ALL", // ALL, ONLINE, OFFLINE
            query: "",
            validation: "invalid",  // valid, invalid, loading
            validationMsg: "",
            validationIsLoading: false,
            userinfo: ""
        }
    }

    componentWillMount() {
        this.setState({ showing: "ALL"});
        this.getStreamStatus();
    }

    getStreamStatus(){
        async.filter(this.state.all, isOnline,
            (err, result) => {
                this.setState({ online: result });
            });
        async.filter(this.state.all, isOffline,
            (err, result) => {
                this.setState({ offline: result });
            });
    }

    changeMode(e, props){
        this.setState({showing: props});
    }

    addStreamer(){
        if (this.state.validationIsLoading === false && this.state.validation === "valid"){
            let newArr = this.state.all.concat(this.state.query);
            this.setState({all: newArr});
            this.getStreamStatus();
        }
    }

    handleInput(e){
        var inputVal = e.target.value;
        this.setState({validationIsLoading: true});
        this.setState({query: e.target.value}, () => {
            getJSON("users", this.state.query).then((d)=> {
                if(this.state.query !== inputVal) { return; }
                if (d.message){
                    this.setState({validationMsg: d.message,
                                   validation: "invalid",
                                    userinfo: ""});
                }
                if (d.name){
                    this.setState({validation: "valid",
                                    userinfo: d});
                }
                this.setState({validationIsLoading: false});
                
            });
        })
    }

    mapStreamerList(){
        if (this.state.showing === "ALL"){
            return this.state.all.map(x => <li>{x}</li>)
        }
        if (this.state.showing === "ONLINE"){
            return this.state.online.map(x => <li>{x}</li>)
        }
        return this.state.offline.map(x => <li>{x}</li>)
    }

    render() {
        return <div>
            <div>
                <input onChange={(e) => this.handleInput(e)} value={this.state.query} />
                <i>{this.state.validation}</i> 
                <i>{this.state.validationIsLoading}</i>
                <button onClick={(e)=> this.addStreamer(e)}>add</button>
                <div>
                    <span>{this.state.userinfo.name}</span>
                    <span>{this.state.userinfo.bio}</span>
                    <img src={this.state.userinfo.logo} />
                </div>
            </div>
            <button onClick={(e) => this.changeMode(e, "ALL")}>All</button>
            <button onClick={(e) => this.changeMode(e, "ONLINE")}>Online</button>
            <button onClick={(e) => this.changeMode(e, "OFFLINE")}>Offline</button>
            {this.mapStreamerList()}
        </div>
    }
}



ReactDOM.render(<Main />, document.getElementById('root'));
      