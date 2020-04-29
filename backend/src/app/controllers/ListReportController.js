import Report from '../models/Report';
import File from '../models/File';
import Document from '../models/Document';

class ListReportController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { shopkeeper_id } = req.body;

    const list = await Report.findAll({
      where: {
        shopkeeper_id
      },
      attributes: [],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['title', 'duration'],
        },
        {
          model: File,
          as: 'file',
          attributes: ['url', 'name'],
        }
      ]
    });

    return res.json({
      shopkeeper_id,
      list
    });
  }
}

export default new ListReportController();
