import React from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "api";

interface MessageInterface {
  text: string;
  user: string | null;
  id: string;
}

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = React.useMemo(() => localStorage.getItem("username"), []);

  const [initialized, setInitialized] = React.useState(false);
  const [valueInputChat, setValueInputChat] = React.useState("");
  const [listMessage, setListMessage] = React.useState<MessageInterface[]>([]);
  const [usersCount, setUsersCount] = React.useState(0);
  const [url, setUrl] = React.useState<string | undefined>("");

  const socket = React.useMemo(
    () => (initialized ? io("ws://localhost:5000/") : null),
    [initialized],
  );

  React.useEffect(() => {
    if (initialized) return;

    if (!user) {
      navigate("/");
      return;
    }

    api.postRequest("/join_room", { roomID: id }).then((data) => {
      if (!data || !data?.ok) {
        navigate("/");
        return;
      }
      setInitialized(true);
      setUrl(id);
    });
  }, [id, initialized, navigate, user]);

  React.useEffect(() => {
    if (!socket || !id) return;
    socket.emit("join_room", id);
    socket.on("update_messages", (message: MessageInterface) =>
      setListMessage((listMessage) => [...listMessage, message]),
    );
    socket.on("update_room_users_count", (number) => setUsersCount(number));
    return () => void socket.disconnect();
  }, [socket, id]);

  const handleSendMessage = React.useCallback(() => {
    if (!valueInputChat || !socket) return;
    socket.emit("new_message", valueInputChat, user);
    setValueInputChat("");
  }, [socket, user, valueInputChat]);

  const handleButtonClick = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code !== "Enter") return;
      handleSendMessage();
    },
    [handleSendMessage],
  );

  const handleCopyClick = React.useCallback(() => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(id!);
  }, [id]);

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setValueInputChat(event.target.value),
    [],
  );

  const handleNavigate = React.useCallback(() => navigate("/"), [navigate]);

  if (!initialized || !socket) return null;

  return (
    <Container>
      <Info>
        <img src="/images/arrow.svg" alt="" onClick={handleNavigate} />
        <InfoRoom onClick={handleCopyClick}>Room ID: {url}</InfoRoom>
        <div>In room: {usersCount}</div>
      </Info>
      <MessagesContainer>
        {listMessage.map((item, index) =>
          socket.id === item.id ? (
            <MessagesWrapper key={index}>
              <MessageUser>{item.user}</MessageUser>
              <MessageFromUser>{item.text}</MessageFromUser>
            </MessagesWrapper>
          ) : (
            <MessagesWrapperGuest key={index}>
              <MessageGuest>{item.user}</MessageGuest>
              <MessageFromGuest>{item.text}</MessageFromGuest>
            </MessagesWrapperGuest>
          ),
        )}
      </MessagesContainer>
      <ToolsInput>
        <ChatInput
          onKeyDown={handleButtonClick}
          value={valueInputChat}
          onChange={handleInputChange}
        />
        <ButtonSend onClick={handleSendMessage} disabled={!valueInputChat}>
          <img src="/images/send.png" alt="" width="30px" height="30px" />
        </ButtonSend>
      </ToolsInput>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;

  & ::-webkit-scrollbar {
    width: 0;
  }
`;

const ToolsInput = styled.div`
  display: flex;
  gap: 10px;
`;

const Info = styled.div`
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  color: #b9cbd6;
  align-items: center;
`;

const InfoRoom = styled.div`
  &:hover {
    color: #49b8ff;
    cursor: pointer;
  }
`;

const ButtonSend = styled.button`
  box-sizing: border-box;
  background-color: #49b8ff;
  border: none;
  border-radius: 28px;
  color: white;
  width: 50px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #1a9ff3;
  }
  &:disabled {
    background-color: #a5aebd;
  }
`;

const ChatInput = styled.input`
  font-weight: 500;
  font-size: 16px;
  box-sizing: border-box;
  border: none;
  outline: 0;
  height: 50px;
  flex: 1;
  padding: 0 20px;
  border-radius: 28px;
  border: #8ed3ff 1px solid;
`;

const MessagesContainer = styled.div`
  border-radius: 28px;
  border: #8ed3ff 1px solid;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 10px 20px;
`;

const MessagesWrapper = styled.div`
  color: #b9cbd6;
  max-width: 50%;
  margin-left: auto;
`;

const MessageFromUser = styled.div`
  padding: 12px;
  display: flex;
  border-radius: 28px;
  background-color: #49b8ff;
  color: white;
  word-break: break-word;
`;

const MessageUser = styled.div`
  text-align: right;
  margin-bottom: 5px;
  font-size: 14px;
`;

const MessageGuest = styled.div`
  text-align: left;
  margin-bottom: 5px;
  font-size: 14px;
`;

const MessagesWrapperGuest = styled.div`
  color: #b9cbd6;
  max-width: 50%;
  margin-right: auto;
`;

const MessageFromGuest = styled.div`
  background-color: #c1cad0;
  color: white;
  padding: 12px;
  display: flex;
  border-radius: 28px;
  word-break: break-word;
`;

export default React.memo(Chat);
