import { object, date, number, string } from 'yup';
import { addMonths, parseISO, isBefore, endOfDay } from 'date-fns';

import Report from '../models/Report';
import Document from '../models/Document';
import ShopKeeper from '../models/ShopKeeper';
class ReportController {
  async store(req, res) {
    const schema = object().shape({
      start_date: date().required(),
      document_id: number().required(),
      shopkeeper_id: number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    try {
      const { start_date, document_id, shopkeeper_id } = req.body;

      const parsedStartDate = parseISO(start_date);

      const document = await Document.findByPk(document_id);

      if (!document) {
        return res.status(401).json({ error: 'Document not found' });
      }

      const shopkeeper = await ShopKeeper.findByPk(shopkeeper_id);

      if (!shopkeeper) {
        return res.status(401).json({ error: 'Shopkeeper not found' });
      }

      if (isBefore(endOfDay(parsedStartDate), new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
      const end_date = addMonths(parsedStartDate, document.duration);

      const reportResponse = await Report.create({
        shopkeeper_id,
        document_id,
        start_date: parsedStartDate,
        end_date,
      });


      return res.json(reportResponse);

    } catch (err) {
      console.log(err);
    }

  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const { count, rows: reports } = await Report.findAndCountAll({
      order: ['id'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'start_date',
        'end_date',
        'active',
        'shopkeeper_id',
        'document_id',
      ],
      include: [
        {
          model: ShopKeeper,
          as: 'shopkeeper',
          attributes: ['employee', 'company', 'email', 'phone'],
        },
        {
          model: Document,
          as: 'document',
          attributes: ['title'],
        },
      ],
    });

    return res.json({ reports, count });
  }

  async show(req, res) {
    const { shopkeeperId } = req.params;

    const report = await Report.findOne({
      where: {
        shopkeeper_id: shopkeeperId,
      },

      include: [
        {
          model: ShopKeeper,
          as: 'shopkeeper',
          attributes: ['employee', 'company', 'email'],
        },
        {
          model: Document,
          as: 'document',
          attributes: ['title', 'duration'],
        },
      ],
    });

    return res.json(report);
  }

  async update(req, res) {
    const schema = object().shape({
      start_date: string().required(),
      document_id: number().required(),
    });

    const { shopkeeperId } = req.params;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { start_date, document_id } = req.body;
    const parsedStartDate = parseISO(start_date);

    /**
     * Search for the shopkeeper with report
     */
    const report = await Report.findOne({
      where: {
        shopkeeper_id: shopkeeperId,
      },
    });

    if (!report) {
      return res
        .status(400)
        .json({ error: 'shopkeeper does not have a report' });
    }

    if (report.active) {
      return res
        .status(400)
        .json({ error: 'Only inactive membership can be updated' });
    }

    if (start_date && isBefore(endOfDay(parsedStartDate), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkDocumentExists = await Document.findByPk(document_id);

    if (!checkDocumentExists) {
      return res.status(401).json({ error: 'Document not found' });
    }

    const end_date = addMonths(parsedStartDate, checkDocumentExists.duration);

    const updatedReport = await report.update({
      shopkeeper_id: shopkeeperId,
      document_id,
      start_date: parsedStartDate,
      end_date,
    });

    return res.json(updatedReport);
  }

  async delete(req, res) {
    Report.destroy({
      where: { id: req.params.id },
    })
      .then(() => res.json({ message: 'removed.' }))
      .catch(err => res.json({ error: 'Fail in methods remove' }));
  }
}

export default new ReportController();
