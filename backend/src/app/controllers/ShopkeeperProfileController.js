import * as Yup from 'yup';
import ShopKeeper from '../models/ShopKeeper';

class ShopkeeperProfileController {
  async update(req, res) {
    const schema = Yup.object().shape({
      employee: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password_hash: Yup.string().min(6).when('oldPassword', (password_hash, field) =>
        password_hash ? field.required().oneOf([Yup.ref('password_hash')]) : field
      ),
      confirmPassword: Yup.string().when('password_hash', (password_hash, field) =>
        password_hash ? field.required().oneOf([Yup.ref('password_hash')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const { email, oldPassword } = req.body;

    const userShopkeeper = await ShopKeeper.findByPk(req.userId);

    if (email !== userShopkeeper.email) {
      const userExists = await ShopKeeper.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User shopkeeper already exists' });
      }
    }

    if (oldPassword && !(await userShopkeeper.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id, employee, password_hash } = await userShopkeeper.update(req.body);

    return res.json({
      id,
      employee,
      email,
    });
  }
}

export default new ShopkeeperProfileController();
