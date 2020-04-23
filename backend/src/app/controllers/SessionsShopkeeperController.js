import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import ShopKeeperModel from '../models/ShopKeeper';

import authConfig from '../../config/auth';

class SessionsShopkeeperController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, password } = req.body;

    const shopkeeper = await ShopKeeperModel.findOne({ where: { email } });

    if (!shopkeeper) {
      return res.status(401).json({ error: 'User shopkeeper does not exist' });
    }

    if (!(await shopkeeper.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, employee } = shopkeeper;

    return res.json({
      shopkeeper: {
        id,
        employee,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn,
      }),
    });
  }
}

export default new SessionsShopkeeperController();
