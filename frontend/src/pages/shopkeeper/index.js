import React, { useState, useEffect } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import { MdPersonAdd } from 'react-icons/md';
import { toast } from 'react-toastify';

import Loading from '~/components/Loading';
import Pagination from '~/components/Pagination';
import history from '~/services/history';
import api from '~/services/api';

import { Container, ShopkeeperList } from './styles';

export default function Shopkeeper() {
  const [shopkeeper, setShopkeepers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const textAlignStyle = {
    textAlign: 'center',
  };

  const loadShopkeeper = async () => {
    try {
      const { data } = await api.get('/shopkeeper', {
        params: { page, filter },
      });

      setTotalPages(Math.ceil(data.count / 10));
      setShopkeepers(data.shopkeeper);
    } catch (err) {
      toast.error(
        (err.response && err.response.data.error) ||
          'Erro de comunicação com o servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadShopkeeper();
  }, [page]); //eslint-disable-line

  const handleEdit = id => {
    history.push(`/shopkeeper/${id}`);
  };

  const handleDelete = shopkeeper => {
    confirmAlert({
      title: 'Confirme a exclusão',
      message: `Deseja remover o lojista ${shopkeeper.employee} ?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`shopkeeper/${shopkeeper.id}`);
              toast.success('Lojista excluido com sucesso');
              setPage(shopkeeper.length === 1 ? page - 1 : page);
              setShopkeepers(shopkeeper.filter(s => s.id !== shopkeeper.id));
            } catch (err) {
              toast.error(
                (err.response && err.response.data.error) ||
                  'Erro de comunicação com o servidor'
              );
            }
          },
        },
        {
          label: 'No',
          onClick: () => '',
        },
      ],
    });
  };

  const handleSearch = () => {
    if (page === 1) return loadShopkeeper();

    return setPage(1);
  };

  /*   const filteredStudents = filter
    ? students.filter(student => {
        const regex = new RegExp(filter, 'i');
        return regex.test(student.name);
      })
    : students; */

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <div>
            <h1>Gerenciamento de lojistas</h1>
            <div>
              <button
                type="button"
                onClick={() => history.push('/shopkeeper/new')}
              >
                <MdPersonAdd size={18} />
                <span>CADASTRAR</span>
              </button>
              <input
                type="text"
                placeholder="Buscar Lojista"
                value={filter}
                onChange={({ target }) => setFilter(target.value)}
                onKeyPress={e => (e.key === 'Enter' ? handleSearch() : '')}
              />
            </div>
          </div>
          {!shopkeeper.length ? (
            <p>Nenhum lojista encontrado...</p>
          ) : (
            <>
              <ShopkeeperList>
                <li>
                  <strong>LOJISTA</strong>
                  <strong>E-MAIL</strong>
                  <strong style={textAlignStyle}>EMPRESA</strong>
                </li>
                {shopkeeper.map(shopkeeper => (
                  <li key={shopkeeper.id}>
                    <span>{shopkeeper.employee}</span>{/* employe */}
                    <span>{shopkeeper.email}</span>{/* ok */}
                    <span style={textAlignStyle}>{shopkeeper.company}</span>{/* company */}
                    <div>
                      <button
                        type="button"
                        onClick={() => handleEdit(shopkeeper.id)}
                      >
                        editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(shopkeeper)}
                      >
                        apagar
                      </button>
                    </div>
                  </li>
                ))}
              </ShopkeeperList>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </>
          )}
        </>
      )}
    </Container>
  );
}
