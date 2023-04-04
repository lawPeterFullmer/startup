import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../Components/JoinGamePage/JoinGamePage.css";
import {useState, useEffect, useMemo} from 'react';
import io from 'socket.io-client';

import Participants from '../Components/JoinGamePage/Participants.jsx';

function JoinGamePage() {
    const [socket, setSocket] = useState(null);
    const [inRoom, setInRoom] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [rows, setRows] = useState([]);
    const [gameID, setGameID] = useState("");
    const [loading, setLoading] = useState(false);

    function getGameID() {
        return gameID;
    }
    function handleGameCodeInputChange(event) {
        setGameID(event.target.value.toUpperCase().slice(0, 4));
    }
    // ---------- socket.io ----------
    function handleJoinRoom() {
        setLoading(true);
        socket.emit("join_room", {
            room: gameID,
            asHost: false,
            username: localStorage.getItem("username")
        });
    }
    // function sendMessage() {
    //     socket.emit("send_message", {
    //         message: "hello",
    //         room: gameID,
    //         username: localStorage.getItem("username")
    //     });
    // }
    useEffect(() => {
        if (socket) {
            socket.on("receive_message", (data) => {
                if (data.message == "joined room") {
                    socketWhoIsHere();
                    setInRoom(true);
                    setLoading(false);
                } else if (data.message == "failed to join room") {
                    alert("The room you entered does not exist.");
                    setLoading(false);
                } else if (data.message == "I am here") {
                    alert(data.message);
                } else {
                    // alert(data.message);
                }
            });
        }
    }, [socket]);

    useEffect(() => {
        setSocket(io.connect("http://localhost:4000")); // the url to the backend server
    }, [])

    function socketWhoIsHere() {
        socket.emit("send_message", {
            message: "who is here?",
            room: getGameID(),
            username: localStorage.getItem("username")
        });
    }
    // -------------------------------
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    }}>
        {(inRoom && !inGame) && <Card id="JoinGameCard">
            <Card.Header>
                <h3>{gameID}</h3>
            </Card.Header>
            <Card.Body>
                <Participants />
            </Card.Body>
        </Card>}
        {(!inRoom && !inGame) && <Card>
            <Card.Header>
                <h2>Join Game</h2>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Control placeholder="Enter room code" value={gameID} onChange={handleGameCodeInputChange}/>
                    </Form.Group>
                </Form>
                
            </Card.Body>
            <Card.Footer>
                <Button disabled={gameID.length !== 4} onClick={handleJoinRoom}>Join Game</Button>
            </Card.Footer>
            </Card>}
    </div>)
}

export default JoinGamePage;