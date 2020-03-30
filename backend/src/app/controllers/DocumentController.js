import { object, string, number } from 'yup';
import Document from '../models/Document';

class DocumentController {
  async store(req, res) {
    const schema = object().shape({
      title: string().required(),
      duration: number()
        .required()
        .integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const documentExist = await Document.findOne({
      where: { title: req.body.title },
    });

    if (documentExist) {
      return res.status(401).json({ error: 'Document already exist' });
    }

    const { id } = await Document.create(req.body);

    return res.json({
      id,
    });
  }

  async index(req, res) {
    const documents = await Document.findAll();

    return res.json(documents);
  }

  async show(req, res) {
    const { id } = req.params;

    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(401).json({ error: 'Document does not exist' });
    }

    return res.json(document);
  }

  async update(req, res) {
    const schema = object().shape({
      title: string().required(),
      duration: number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(401).json({ error: 'Document does not exist.' });
    }

    const { title } = req.body;

    if (title && title !== document.title) {
      const checkTitle = await Document.findOne({ where: { title } });

      if (checkTitle) {
        return res.status(401).json({ error: 'Document must be unique' });
      }
    }

    const { duration } = await document.update(req.body);

    return res.json({ title, duration, message: 'Updated success' });
  }

  async delete(req, res) {
    Document.destroy({
      where: { id: req.params.id },
    })
      .then(() => res.json({ message: 'removed.' }))
      .catch(err => res.json({ error: 'Fail in methods remove' }));
  }
}

export default new DocumentController();
