import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUserEdit } from 'react-icons/fa';

import LinkWrapper from '~/helpers/LinkWrapper';
import Menu from './Menu';

import { Container, Content, Profile } from './styles';

export default function Header() {
  const [width, setWidth] = useState([0]);
  const profile = useSelector(state => state.user.profile);

  useLayoutEffect(() => {
    function updateWidth() {
      setWidth([window.innerWidth]);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Container>
      <Content>
        {width < 768 ? (
          <nav>
            <Menu />
          </nav>
        ) : (
          <nav>
            <span><LinkWrapper to="/">DOC'S LOJISTAS</LinkWrapper></span>
            <LinkWrapper to="/shopkeeper">Lojas</LinkWrapper>
            <LinkWrapper to="/documents">Laudos</LinkWrapper>
            <LinkWrapper to="/memberships">Vinculação</LinkWrapper>
            <LinkWrapper to="/helporders">Next new feature</LinkWrapper>
          </nav>
        )}

        <aside>
          <Profile>
            <strong>{profile.name}</strong>
            <LinkWrapper to="/profile">Meu perfil <FaUserEdit style={{color: '#194390'}} size={16} /> </LinkWrapper>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
