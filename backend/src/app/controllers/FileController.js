import File from '../models/File';
import { extname } from 'path';

class FileController {
  async index(req, res) {
    const file = await File.findAll();

    return res.json(file);
  }

  async show(req, res) {
    const { id } = req.params;

    const {url, name, size} = await File.findOne({id});

    return res.json({ id, name, url, size });
  }

  async store(req, res) {
    const { originalname: name,size, filename: key, location: url = "" } = req.file;

    if (extname(name) !== '.pdf') {
      return res.status(400).json({ "error": "Only file extension with .pdf" });
    }

    const file = await File.create({
      name,
      size,
      key,
      url,
    });

    if (!file) {
      return res.status(400).json({error: "Extension wrong!! please only .pdf"});
    }

    return res.json(file);
  }

  async delete(req, res) {
    const { id } = req.params;

    const file = await File.findByPk(id);

   await file.destroy();

  return res.send();
  }
}

export default new FileController();
