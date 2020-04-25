import React, { useState, useEffect } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';

import Loading from '~/components/Loading';
import history from '~/services/history';
import api from '~/services/api';

import { Container, DocumentList } from './styles';

export default function Document() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const textAlignStyle = {
    textAlign: 'center',
  };

  useEffect(() => {
    const loadDocuments = async () => {
      const response = await api.get('documents');

      setDocuments(response.data);
      setLoading(false);
    };

    loadDocuments();
  }, []);

  const handleEdit = id => {
    history.push(`/documents/${id}`);
  };

  const handleDelete = document => {
    confirmAlert({
      title: 'Confirme a exclusão',
      message: `Deseja remover o laudo ${document.title} ?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`documents/${document.id}`);
              toast.success('Tipo de Laudo excluido com sucesso');
              setDocuments(documents.filter(s => s.id !== document.id));
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

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <div>
            <h1>Categoria de Laudos</h1>
            <div>
              <button type="button" onClick={() => history.push('/documents/new')}>
                <MdAdd size={18} />
                <span>Laudos Loja </span>
              </button>
            </div>
          </div>
          {!documents.length ? (
            <p>Nenhum laudo encontrado...</p>
          ) : (
            <DocumentList>
              <li>
                <strong>CATEGORIA</strong>
                <strong style={textAlignStyle}>DURAÇÃO</strong>
              </li>
              {documents.map(document => (
                <li key={document.id}>
                  <span>{document.title}</span>
                  <span style={textAlignStyle}>{`${document.duration} ${
                    document.duration === 1 ? 'mês' : 'meses'
                  }`}</span>
{/*                   <span style={textAlignStyle}>sad</span>
 */}
                  <div>
                    <button type="button" onClick={() => handleEdit(document.id)}>
                      editar
                    </button>
                    <button type="button" onClick={() => handleDelete(document)}>
                      apagar
                    </button>
                  </div>

                </li>
              ))}
            </DocumentList>
          )}
        </>
      )}
    </Container>
  );
}
