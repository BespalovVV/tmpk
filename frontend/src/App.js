import React from "react";
import UsersList from "./components/Users/UsersList";
import DivWrapper from "./components/Registration"

function App() {
  return (
    <div>
      <h1>Приложение</h1>
      <UsersList/>
      <DivWrapper/>
    </div>
  );
}

export default App;
