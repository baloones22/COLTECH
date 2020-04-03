import styled from 'styled-components';

import colors from '~/styles/colors';

export const Container = styled.div`
  width: 100%;
  max-width: 700px;
  min-width: 550px;
  margin: 30px auto;
  padding: 0 2px;

  div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;

    h1 {
      color: ${colors.darkGray};
      font-size: 24px;
    }
  }

  @media (min-width: 768px) {
    div {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }
`;

;
