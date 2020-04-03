import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { MdKeyboardArrowLeft, MdSave } from 'react-icons/md';
import * as Yup from 'yup';

import Loading from '~/components/Loading';
import history from '~/services/history';
import api from '~/services/api';
import { Container, Header } from './styles';

const schema = Yup.object().shape({
  employee: Yup.string().required('Campo Nome do funcionário é obrigatório'),
  company: Yup.string().required('Campo de campany  é obrigatório'),
  email: Yup.string()
    .email('Digite um email valido')
    .required('Campo E-mail é obrigatório'),
  phone: Yup.number()
    .required('Campo peso é obrigatório')
    .positive('Campo contato precisa ser positivo')
});

export default function ManageShopkeepers() {
  const [shopkeeper, setShopkeepers] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getShopkeeper = async () => {
        const response = await api.get(`/shopkeeper/${id}`);

        setShopkeepers(response.data);
        setLoading(false);
      };

      getShopkeeper();
    }
  }, [id]);

  const handleStore = async data => {
    setLoading(true);
    try {
      const res = await api.post('shopkeeper', { ...data });

      toast.success('Lojista cadastrado com sucesso');
      history.push(`/shopkeeper/${res.data.id}`);
    } catch (err) {
      toast.error(
        (err.response && err.response.data.error) ||
          'Erro de comunicação com o servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async data => {
    setLoading(true);
    try {
      await api.put(`shopkeeper/${id}`, { ...data });

      toast.success('Lojista atualizado com sucesso');
      history.push(`/shopkeeper`);
    } catch (err) {
      toast.error(
        (err.response && err.response.data.error) ||
          'Erro de comunicação com o servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <Header>
            <h1>{id ? 'Edição de lojista' : 'Cadastro de lojista'}</h1>
            <div>
              <button type="button" onClick={() => history.push('/shopkeeper')}>
                <MdKeyboardArrowLeft size={20} color="#fff" />
                <span>VOLTAR</span>
              </button>
              <button type="submit" form="form-students">
                <MdSave size={20} color="#fff" />
                <span>SALVAR</span>
              </button>
            </div>
          </Header>
          <Form
            schema={schema}
            onSubmit={id ? handleUpdate : handleStore}
            initialData={shopkeeper}
            id="form-students"
          >
            <div>
              <label>NOME DO FUNCIONÁRIO</label>
              <Input id="employee" name="employee" placeholder="Nome do funcionário" />

              <label>ENDEREÇO DE E-MAIL</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
              />

              <label>EMPRESA</label>
              <Input id="company" name="company" placeholder="Pertence a qual empresa?" />
            </div>
            <div className="infoStudent-second">
              <label>
                NUMERO DE CONTATO
                <Input id="phone" name="phone" type="tel" placeholder="9 99232-9942" />
              </label>

            </div>
          </Form>
        </>
      )}
    </Container>
  );
}
