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
            <span>DOC LOJISTAS</span>
          </nav>
        ) : (
          <nav>
            <span>DOC LOJISTAS</span>
            <LinkWrapper to="/students">LOJAS</LinkWrapper>
            <LinkWrapper to="/plans">LAUDOS</LinkWrapper>
            <LinkWrapper to="/memberships">VINCULÇÃO</LinkWrapper>
            <LinkWrapper to="/helporders">PEDIDOS DE AUXÍLIO</LinkWrapper>
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
