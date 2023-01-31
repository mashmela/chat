import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";

import Chat from "views/Chat";
import MainPage from "views/MainPage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  width: 100vw;
  padding: 20px 10px;
  box-sizing: border-box;
  overflow: hidden;

  * {
    font-family: "Roboto";
  }
`;

function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:id" element={<Chat />} />
      </Routes>
    </Container>
  );
}

export default App;
