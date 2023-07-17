import React,{ useContext }  from 'react';
import ReactDOM from 'react-dom/client';
import ThemeContextProvider from './context/themeContext';
import { ThemeContext } from "./context/themeContext";
import './index.css';
import { Suspense } from 'react';
import { styled } from 'styled-components';
const App=React.lazy(()=>import('./App'));
const root = ReactDOM.createRoot(document.getElementById('root'));
const Loader=styled.div`
  background-color: ${props=>`var(--bg-${props.theme})`};
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loader {
    animation: rotate 1s infinite;
    height: 50px;
    width: 50px;
  }

  .loader:before,
  .loader:after {
    border-radius: 50%;
    content: "";
    display: block;
    height: 20px;
    width: 20px;
  }
  .loader:before {
    animation: ball1 1s infinite;
    background-color: var(--first-color);
    box-shadow: 30px 0 0 var(--second-color);
    margin-bottom: 10px;
  }
  .loader:after {
    animation: ball2 1s infinite;
    background-color: var(--second-color);
    box-shadow: 30px 0 0 var(--first-color);
  }

  @keyframes rotate {
    0% { transform: rotate(0deg) scale(0.8) }
    50% { transform: rotate(360deg) scale(1.2) }
    100% { transform: rotate(720deg) scale(0.8) }
  }

  @keyframes ball1 {
    0% {
      box-shadow: 30px 0 0 var(--second-color);
    }
    50% {
      box-shadow: 0 0 0 var(--second-color);
      margin-bottom: 0;
      transform: translate(15px, 15px);
    }
    100% {
      box-shadow: 30px 0 0 var(--second-color);
      margin-bottom: 10px;
    }
  }

  @keyframes ball2 {
    0% {
      box-shadow: 30px 0 0 var(--first-color);
    }
    50% {
      box-shadow: 0 0 0 var(--first-color);
      margin-top: -20px;
      transform: translate(15px, 15px);
    }
    100% {
      box-shadow: 30px 0 0 var(--first-color);
      margin-top: 0;
    }
  }
  
`

function MainApp() {
  const {themeState}=useContext(ThemeContext)
  return (
    <Suspense fallback={<Loader theme={themeState}><span class="loader"></span></Loader>}>
      <App />
    </Suspense>
  )
}
export default MainApp;

root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <MainApp/>
    </ThemeContextProvider>
  </React.StrictMode>
)