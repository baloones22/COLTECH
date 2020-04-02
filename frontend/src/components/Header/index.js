import React, { useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinkWrapper from '~/helpers/LinkWrapper';
import Menu from './Menu';

import { Container, Content, Profile } from './styles';

import { signOut } from '~/store/modules/auth/actions';

export default function Header() {
  const [width, setWidth] = useState([0]);
  const profile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    function updateWidth() {
      setWidth([window.innerWidth]);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleSignout = () => {
    dispatch(signOut());
  };

  return (
    <Container>
      <Content>
        {width < 768 ? (
          <nav>
            <Menu />
          </nav>
        ) : (
          <nav>
            <span>DOC'S LOJISTA</span>
            <LinkWrapper to="/shopkeeper">Lojas</LinkWrapper>
            <LinkWrapper to="/documents">Tipos de documentos</LinkWrapper>
            <LinkWrapper to="/memberships">Laudos</LinkWrapper>
            <LinkWrapper to="/helporders">Next new feature</LinkWrapper>
          </nav>
        )}

        <aside>
          <Profile>
            <strong>{profile.name}</strong>
            <button type="button" onClick={handleSignout}>
              sair do sistema
            </button>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
