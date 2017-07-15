// User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.

// User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.

// User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.


async function getJSON(categ, name) {
    var data = $.getJSON('https://wind-bow.gomix.me/twitch-api/' + categ + '/' + name + '?callback=?', function (data) {
    });
    return data;
}

function isStreaming(item, callback) {
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
            streamers: ["_ werds", "gawjasef", "OGN_LoL", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
            showing: []
        }
    }

    componentWillMount() {
        this.setState({ showing: this.state.streamers });
    }

    showOnline(e) {
        async.filter(this.state.streamers, isStreaming,
            (err, result) => {
                this.setState({ showing: result });
            });
    }

    showOffline(e) {
        async.filter(this.state.streamers, isOffline,
            (err, result) => {
                this.setState({ showing: result });
            });
    }

    addStreamer(){
        
    }

    showAll() {
        this.setState({showing: this.state.streamers});
    }

    render() {
        const shows = this.state.showing.map(x => <li>{x}</li>)

        return <div>{this.state.test}
            <button onClick={(e) => this.showAll(e)}>All</button>
            <button onClick={(e) => this.showOnline(e)}>Online</button>
            <button onClick={(e) => this.showOffline(e)}>Offline</button>
            {shows}
        </div>
    }
}



ReactDOM.render(<Main />, document.getElementById('root'));