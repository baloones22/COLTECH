import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { MdKeyboardArrowLeft, MdSave } from 'react-icons/md';
import { addMonths, parseISO } from 'date-fns';
import debounce from 'debounce-promise';
import * as Yup from 'yup';

import Loading from '~/components/Loading';
import history from '~/services/history';
import api from '~/services/api';
import colors from '~/styles/colors';
import { formatPrice } from '~/helpers/format';

import { Container, Header, Student, Info } from './styles';

const schema = Yup.object().shape({
  start_date: Yup.date().required('Campo data de inicio é obrigatório'),
  document_id: Yup.number().required('Campo tipo de documento é obrigatório'),
  shopkeeper_id: Yup.number().required('Campo lojista é obrigatório'),
});

export default function ManageMembership() {
  const [membership, setMembership] = useState({}); // to prevent NaN on field 'Valor Final'
  const [shopkeepers, setShopkeepers] = useState({});
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const { shopkeeperId } = useParams();

  useEffect(() => {
    if (shopkeeperId) {
      const getMembership = async () => {
        //busca a associação por id
        const { data } = await api.get(`/reports/${shopkeeperId}`);

        await setMembership({
          ...data,
          start_date: data.document ? parseISO(data.start_date) : '',
          end_date: data.document ? parseISO(data.end_date) : '',
        });
      };

      getMembership();
    }
  }, [shopkeeperId]);

  useEffect(() => {
    if (!shopkeeperId) {
      const loadShopkeepers = async () => {
        const { data } = await api.get('shopkeeper');

        setShopkeepers(data);
      };

      loadShopkeepers();
    }
  }, [shopkeeperId]);

  useEffect(() => {
    const loadDocuments = async () => {
      const { data } = await api.get('reports');

      setDocuments(data);
      setLoading(false);
    };

    loadDocuments();
  }, []);

  const getShopkeeper = async filter => {
    if (!filter) {
      return [];
    }

    const { data } = await api.get('shopkeeper', {
      params: {
        filter,
      },
    });
    return data;
  };

  const wait = 1500; // milliseconds
  const loadOptions = inputValue => getShopkeeper(inputValue);
  const debouncedLoadOptions = debounce(loadOptions, wait, {
    leading: true,
  });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await schema.validate(
        {
          start_date: membership.start_date,
          document_id: membership.document_id,
          shopkeeper_id: shopkeeperId || membership.shopkeeper_id,
        },
        {
          abortEarly: false,
        }
      );
    } catch (err) {
      err.inner.forEach((error: ValidationError) => {
        toast.error(error.message);
      });
      return;
    }

    setLoading(true);

    try {
      if (shopkeeperId) {
        const data = {
          start_date: membership.start_date,
          document_id: membership.document_id,
        };

        await api.put(`reports/${shopkeeperId}`, { ...data });

        toast.success('Associação atualizada com sucesso');
        history.push(`/memberships/`);
      } else {
        const data = {
          start_date: membership.start_date,
          document_id: membership.document_id,
          shopkeeper_id: membership.shopkeeper_id,
        };

        await api.post('reports', { ...data });

        toast.success('Associação realizada com sucesso');
        history.push(`/memberships/${membership.shopkeeper_id}`);
      }
    } catch (err) {
      toast.error(
        (err.response && err.response.data.error) ||
          'Erro de comunicação com o servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    option: (styles, state) => ({
      ...styles,
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      fontWeight: 'normal',
    }),
    control: (styles, state) => ({
      ...styles,
      border: `1px solid ${colors.border}`,
      boxShadow: state.isFocused && `1px solid ${colors.border}`,
      '&:hover': {
        border: `1px solid ${colors.border}`,
      },
      borderRadius: '4px',
      display: 'flex',
      width: '100%',
      height: '45px',
      marginTop: '7px',
      fontWeight: 'normal',
    }),
    placeholder: styles => ({
      ...styles,
      fontWeight: 'normal',
    }),
    indicatorSeparator: styles => ({
      ...styles,
      display: 'none',
    }),
  };

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <Header>
            <h1>
              {shopkeeperId ? 'Edição de associação' : 'Cadastro da associação'}
            </h1>
            <div>
              <button
                type="button"
                onClick={() => history.push('/memberships')}
              >
                <MdKeyboardArrowLeft size={20} color="#fff" />
                <span>VOLTAR</span>
              </button>
              <button type="submit" form="form-memberships">
                <MdSave size={20} color="#fff" />
                <span>SALVAR</span>
              </button>
            </div>
          </Header>
          <form id="form-memberships" onSubmit={handleSubmit}>
            <Student>
              <label>LOJISTA </label>
              <AsyncSelect
                isDisabled={shopkeeperId}
                styles={customStyles}
                defaultOptions={shopkeepers}
                loadOptions={inputValue => debouncedLoadOptions(inputValue)}
                multiple={false}
                name="shopkeeper"
                placeholder="Buscar lojista"
                getOptionValue={shopkeeper => shopkeeper.id}
                getOptionLabel={shopkeeper => shopkeeper.employe}
                value={membership ? membership.shopkeeper : ''}
                onChange={e =>
                  setMembership({
                    ...membership,
                    shopkeeper_id: e.id,
                    shopkeeper: e,
                  })
                }
              />
            </Student>
            <Info>
              <label>
                Documento
                <Select
                  styles={customStyles}
                  options={documents}
                  multiple={false}
                  name="document"
                  placeholder="Tipos de documento"
                  value={membership ? membership.document : ''}
                  getOptionValue={document => document.id}
                  getOptionLabel={document => document.title}
                  onChange={e =>
                    setMembership({
                      ...membership,
                      document_id: e.id,
                      document: e,
                    })
                  }
                />
              </label>
              <label>
                DATA DE INÍCIO
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  name="start_date"
                  autoComplete="off"
                  placeholder="Escolha a data"
                  selected={membership ? membership.start_date : ''}
                  onChange={date => {
                    if (!membership.document) {
                      toast.error('Favor selecionar um tipo de documento!');
                      return;
                    }
                    if (date) {
                      setMembership({
                        ...membership,
                        start_date: date,
                        end_date: addMonths(date, membership.document.duration),
                      });
                    }
                  }}
                />
              </label>
              <label>
                DATA DE TÉRMINO
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  name="end_date"
                  disabled
                  placeholder="Data de termino"
                  selected={membership ? membership.end_date : ''}
                />
              </label>
              <label>
                VALOR FINAL
                <input
                  type="text"
                  name="price"
                  value={membership ? formatPrice(membership.duration) : ''}
                  disabled
                />
              </label>
            </Info>
          </form>
        </>
      )}
    </Container>
  );
}
