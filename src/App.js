import Header from './Components/Header';
import './App.css';
import { ThemeContext } from './context/themeContext';
import { useContext } from 'react';
import Todo from './Components/Todo';
import { styled } from 'styled-components';
const AppContainer = styled.div`
  min-height: 100vh;
  transition: 0.5s ease-in-out;
  background-color: ${props=>`var(--bg-${props.theme})`};
  color: ${props=>`var(--text-color-${props.theme})`};
`
function App() {
  const {themeState}=useContext(ThemeContext)
  return (
    <AppContainer theme={themeState}>
      <Header/>
      <Todo/>
    </AppContainer>
  );
}

export default App;