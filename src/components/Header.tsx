import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Flex } from '../styles/StyledComponents';

const StyledHeader = styled.header`
  background-color: #ff5350;
  padding: 16px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  color: white;
  position: relative;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: white;
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <StyledHeader>
      <Container>
        <Flex justify="space-between">
          <Link to="/">
            <Logo>PokéCompare</Logo>
          </Link>
          <Nav>
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/compare" active={location.pathname === '/compare'}>
              Compare
            </NavLink>
            <NavLink to="/favorites" active={location.pathname === '/favorites'}>
              Favorites
            </NavLink>
          </Nav>
        </Flex>
      </Container>
    </StyledHeader>
  );
};

export default Header;