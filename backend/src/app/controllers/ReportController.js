import { object, date, number, string } from 'yup';
import { addMonths, parseISO, isBefore, isAfter, endOfDay } from 'date-fns';

import Report from '../models/Report';
import Document from '../models/Document';
import ShopKeeper from '../models/ShopKeeper';
/* controler que faz o relacionamento entre o document ae o shopkeeper */
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

    const { start_date, document_id, shopkeeper_id } = req.body;

    const parsedStartDate = parseISO(start_date);

    const checkDocumentExist = await Document.findByPk(document_id);

    if (checkDocumentExist) {
      return res.status(401).json({ error: 'Document not found' });
    }

    const checkShopKeeperExist = await ShopKeeper.findByPk(shopkeeper_id);

    if (checkShopKeeperExist) {
      return res.status(401).json({ error: 'Shopkeeper not found' });
    }

    const checkShopKeeperHasReport = await Report.findOne({
      where: {
        shopkeeper_id,
      },
    });

    if (
      checkShopKeeperHasReport &&
      (checkShopKeeperHasReport.active ||
        isAfter(
          endOfDay(checkShopKeeperHasReport.start_date),
          endOfDay(new Date())
        ))
    ) {
      return res
        .status(400)
        .json({ error: 'Shopkeeper already has one report' });
    }

    if (isBefore(endOfDay(parsedStartDate), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(parsedStartDate, checkDocumentExist.duration);

    const report = await Report.create({
      shopkeeper_id,
      document_id,
      start_date: parsedStartDate,
      end_date,
    });

    /* const reportInfo = await Report.findByPk(report.id, {
      include: [
        {
          model: ShopKeeper,
          as: 'shopkeeper',
          attributes: ['id', 'employee', 'company', 'email', 'phone'],
        },
        {
          model: Document,
          as: 'document',
          attributes: ['title'],
        },
      ],
    }); */

    return res.json(report);
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
