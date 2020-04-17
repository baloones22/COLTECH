import * as Yup from 'yup';
import User from '../models/User';
import ConfirmationMail from '../jobs/ConfirmationMail';
import Queue from '../../lib/Queue';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validations fails' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'User already exist.' });
    }

    const user = await User.create(req.body);
    const { id, name, email } = user;

    await Queue.add(ConfirmationMail.key, { user });

    return res.json({ id, name, email });
  }
}

export default new UserController();
