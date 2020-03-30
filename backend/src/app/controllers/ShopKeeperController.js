import { object, string } from 'yup';
import { Op } from 'sequelize';
import shopKeeper from '../models/ShopKeeper';

class ShopKeeperController {
  async store(req, res) {
    const schema = object().shape({
      employee: string().required(),
      company: string().required(),
      email: string()
        .email()
        .required(),
      phone: string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const shopKeepExist = await shopKeeper.findOne({
      where: { email: req.body.email },
    });

    if (shopKeepExist) {
      return res
        .status(400)
        .json({ error: 'The email shopkeeper already exist' });
    }

    const { id, employee, company, email, phone } = await shopKeeper.create(
      req.body
    );

    return res.json({
      id,
      employee,
      company,
      email,
      phone,
    });
  }

  async index(req, res) {
    const { page, filter } = req.query;

    if(filter || page) {
      if(!page) {
        const shopkeeper = await shopKeeper.findAll({
          where: {
            employee: {
              [Op.iLike] : `%${filter}%`,
            },
          },
        });

        return res.json(shopkeeper);
      }

      const { count, rows: shopkeeper } = await shopKeeper.findAndCountAll({
        where: {
          employee: {
            [Op.iLike]: `%${filter}%`,
          },
        },

        order: ['employee'],
        limit: 10,
        offset: (page- 1) * 10,
      });

      return res.json({ shopkeeper, count });
    }

    const shopkeeper = await shopKeeper.findAll({
      order: ['employee'],
    });

    return res.json(shopkeeper);

  }

  async show(req, res) {
    const { id } = req.params;

    const shopkeeper = await shopKeeper.findByPk(id);

    if (!shopKeeper) {
      return res.status(401).json({ error: 'shopkeepr does not exist' });
    }

    return res.json(shopkeeper);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = object().shape({
      employee: string().required(),
      company: string().required(),
      email: string()
        .email()
        .required(),
      phone: string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const shopkeeper = await shopKeeper.findByPk(id);

    const { employee, company, email, phone } = await shopkeeper.update(
      req.body
    );

    return res.json({ employee, company, email, phone });
  }

  async delete(req, res) {
    shopKeeper
      .destroy({
        where: { id: req.params.id },
      })
      .then(() => res.json({ message: 'removed.' }))
      .catch(err => res.json({ error: 'Fail in methods remove' }));
  }
}

export default new ShopKeeperController();
