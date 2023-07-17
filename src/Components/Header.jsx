import React,{ useContext } from 'react'
//import sun from '../images/icon-sun.svg'
import { styled } from 'styled-components';
import { ThemeContext } from '../context/themeContext';
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: white;
  margin: 0;
`;
// eslint-disable-next-line no-undef
const Wrapper = styled.header`
  width: 100%;
  height: 180px;
  padding-top: 5em;
  background-image:url(${props => `images/bg-desktop-${props.theme}.jpg`}),url("images/bg-desktop-dark.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center top;
  transition: 0.5s ease-in-out;
  @media screen and (max-width:500px){
    padding-top:3em;
    background-image:url(${props => `images/bg-mobile-${props.theme}.jpg`}),url("images/bg-mobile-dark.jpg");
  }
`;
// eslint-disable-next-line no-undef
const SwitcherTheme=styled.div`
  width: 30px;
  height: 30px;
  background: url(${props => props.theme==="dark"?"images/icon-moon.svg":"images/icon-sun.svg"});
  background-size: cover;
  background-repeat:no-repeat;
  background-position:center;
  transition: 0.5s ease-in-out;
  cursor: pointer;
`
const HeaderContainer=styled.div`
  display: flex;
  max-width: var(--max-contain-size);
  justify-content: space-between;
  align-items: center;
  margin: auto;
  @media screen and (max-width:500px){
    --max-contain-size: 90%;
  }
`
export default function Header() {
  const {themeState,toogleTheme}=useContext(ThemeContext)
  return (
    <Wrapper theme={themeState}>
        <HeaderContainer>
          <Title>TODO</Title>
          <SwitcherTheme theme={themeState} onClick={toogleTheme}/>
        </HeaderContainer>
    </Wrapper>
  )
}
