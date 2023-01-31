import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { api } from "api";

function MainPage() {
  const navigate = useNavigate();

  const [roomID, setRoomID] = React.useState("");
  const [username, setUsername] = React.useState(localStorage.getItem("username") || "");

  const handleJoinRoom = React.useCallback(async () => {
    if (!roomID || !username) return;

    const result = await api.postRequest("/join_room", { roomID });
    if (!result || !result?.ok) return;

    localStorage.setItem("username", username);
    navigate(`/${roomID}`);
  }, [navigate, roomID, username]);

  const handleCreateRoom = React.useCallback(async () => {
    if (!username) return;

    const result = await api.getRequest("/create_room");
    if (!result || !result?.ok) return;

    localStorage.setItem("username", username);
    navigate(`/${result.roomId}`);
  }, [navigate, username]);

  return (
    <Container>
      <NewInput
        placeholder="Your Name"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <ContainerJoin>
        <NewInput
          placeholder="Room ID"
          value={roomID}
          onChange={(ev) => setRoomID(ev.target.value)}
        />
        <Button width="100px" onClick={handleJoinRoom}>
          Join
        </Button>
      </ContainerJoin>
      <Button onClick={handleCreateRoom} width="100%">
        Create your room
      </Button>
    </Container>
  );
}

const Container = styled.div`
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  max-width: 380px;
  width: 100%;
  margin: 300px auto 0;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ContainerJoin = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;

const Button = styled.button<{ width: string }>`
  box-sizing: border-box;
  font-weight: 700;
  background-color: #49b8ff;
  border: none;
  color: white;
  height: 50px;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 16px;
  border-radius: 28px;
  cursor: pointer;
  transition: 0.3s;
  width: ${({ width }) => width};

  &:hover {
    background-color: #1a9ff3;
  }
`;

const NewInput = styled.input`
  font-weight: 600;
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0px 40px;
  border-radius: 28px;
  border: #8ed3ff 3px solid;
  outline: 0 !important;

  &::placeholder {
    color: #b9cbd6;
  }
`;

export default React.memo(MainPage);
