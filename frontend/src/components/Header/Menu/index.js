import React from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

import useComponentVisible from '~/helpers/hooks/useComponentVisible';
import LinkWrapper from '~/helpers/LinkWrapper';

import { Container } from './styles';

export default function Menu() {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  return (
    <Container visible={isComponentVisible}>
      <button type="button" onClick={setIsComponentVisible}>
        {isComponentVisible ? <MdClose size={26} /> : <MdMenu size={26} />}
      </button>

      {isComponentVisible ? (
        <>
          <div ref={ref}>
            <LinkWrapper to="/students">LOJISTAS</LinkWrapper>
            <LinkWrapper to="/plans">DOCUMENTAÇÃO</LinkWrapper>
            <LinkWrapper to="/memberships">LAUDOS</LinkWrapper>
            <LinkWrapper to="/helporders">PEDIDOS DE AUXÍLIO</LinkWrapper>
          </div>
          <div />
        </>
      ) : null}
    </Container>
  );
}
