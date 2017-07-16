// User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.

// User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.

// User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.

async function getJSON(categ, name) {
    var data = $.getJSON('https://wind-bow.gomix.me/twitch-api/' + categ + '/' + name + '?callback=?', function (data) {
        ;
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
        this.setState({ showing: "ALL" });
        this.getStreamStatus();
    }

    getStreamStatus() {
        async.filter(this.state.all, isOnline,
            (err, result) => {
                this.setState({online: result});
                //console.log(result);
                //this.loadStreamData(result);
            });
        async.filter(this.state.all, isOffline,
            (err, result) => {
                this.setState({ offline: result });
            });
    }
    loadStreamData(r){
        // make an array of strings into objects
        async.map(r, function (item, callback) {
            return item += "wow";
        }, (err, result) => {
            this.setState({online: result});
            console.log(result);
        })
    }

    changeMode(e, props) {
        this.setState({ showing: props });
    }

    addStreamer() {
        if (this.state.validationIsLoading === false && this.state.validation === "valid") {
            let newArr = this.state.all.concat(this.state.query);
            this.setState({ all: newArr });
            this.getStreamStatus();
        }
    }

    handleInput(e) {
        var inputVal = e.target.value;
        this.setState({ validationIsLoading: true });
        this.setState({ query: e.target.value }, () => {
            getJSON("users", this.state.query).then((d) => {
                if (this.state.query === "") { this.setState({ userinfo: "" }) }
                if (this.state.query !== inputVal) { return; }
                if (d.message) {
                    this.setState({
                        validationMsg: d.message,
                        validation: "invalid",
                        userinfo: "",
                        validationIsLoading: false
                    });
                }
                if (d.name) {
                    this.setState({
                        validation: "valid",
                        userinfo: d,
                        validationIsLoading: false
                    });
                }
            });
        })
    }

    mapStreamerList() {
        if (this.state.showing === "ALL") {
            return this.state.all.map(x => {
                return <li>{x}</li>;
        })}
        if (this.state.showing === "ONLINE") {
            return this.state.online.map(x => <li>{x}</li>)
        }
        return this.state.offline.map(x => <li>{x}</li>)
    }

    userInfoCard() {
        if (this.state.validation === "valid" && this.state.validationIsLoading === false) {
            return <div className="card horizontal small">
                <div className="card-image">
                    <img src={this.state.userinfo.logo} />
                </div>
                <div className="card-stacked">
                    <div className="card-content">
                        <h2>{this.state.userinfo.name}</h2>
                        <p>{this.state.userinfo.bio}</p>
                    </div>
                    <div className="card-action">
                        <a onClick={(e) => this.addStreamer(e)}>Add This Streamer to the List!</a>
                    </div>
                </div>
            </div>
        }
        return;
    }

    render() {
        return <div className="container-fluid">
            <div className="row">
                <div className="col m6 s12 ">
                    <input onChange={(e) => this.handleInput(e)} value={this.state.query} />
                    <i>{this.state.validation}</i>
                    <i>{this.state.validationIsLoading}</i>
                    <button onClick={(e) => this.addStreamer(e)}>add</button>
                </div>
            </div>
            <div className="row">
                <div className="col m12 s12 results">
                    {this.userInfoCard()}
                    <button onClick={(e) => this.changeMode(e, "ALL")}>All</button>
                    <button onClick={(e) => this.changeMode(e, "ONLINE")}>Online</button>
                    <button onClick={(e) => this.changeMode(e, "OFFLINE")}>Offline</button>
                    {this.mapStreamerList()}
                </div>
            </div>
        </div>
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
