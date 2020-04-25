import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
/* import NumberFormat from 'react-number-format';
 */
import { MdKeyboardArrowLeft, MdSave } from 'react-icons/md';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

/* import { formatPrice } from '~/helpers/format';
 */
import Loading from '~/components/Loading';
import history from '~/services/history';
import api from '~/services/api';
import { Container, Header } from './styles';

const schema = Yup.object().shape({
  title: Yup.string().required('Campo title é obrigatório'),
  duration: Yup.number()
    .required('Campo duração é obrigatório')
    .integer()
    .positive('Duração precisa ser positivo'),
});

export default function StoreDocument() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getPlan = async () => {
        const { data } = await api.get(`/documents/${id}`);

        setTitle(data.title);
        setDuration(data.duration);
        setLoading(false);
      };

      getPlan();
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await schema.validate(
        {
          title,
          duration,
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
      if (id) {
        await api.put(`documents/${id}`, {
          title,
          duration,
        });

        toast.success('Tipo de Laudo atualizado com sucesso');
        history.push('/documents');
      } else {
        const { data } = await api.post('documents', {
          title,
          duration,
        });

        toast.success('Documento cadastrado com sucesso');
        history.push(`/documents/${data.id}`);
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

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <Header>
            <h1>{id ? 'Edição de categoria' : 'Criar categoria'}</h1>
            <div>
              <button type="button" onClick={() => history.push('/documents')}>
                <MdKeyboardArrowLeft size={20} color="#fff" />
                <span>VOLTAR</span>
              </button>
              <button type="submit" form="form-plans">
                <MdSave size={20} color="#fff" />
                <span>SALVAR</span>
              </button>
            </div>
          </Header>
          <form id="form-plans" onSubmit={handleSubmit}>
            <div>
              <label>TÍTULO DO LAUDO</label>
              <input
                id="title"
                name="title"
                type="name"
                placeholder="Nome da categoria do laudo"
                value={title || ''}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              <label>
                DURAÇÃO (em meses)
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="1"
                  value={duration || ''}
                  onChange={({ target }) => setDuration(target.value)}
                />
              </label>
            </div>
          </form>
        </>
      )}
    </Container>
  );
}
