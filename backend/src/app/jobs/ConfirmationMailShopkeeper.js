import Mail from '../../lib/Mail';

class ConfirmationMailShopkeeper {
  get key() {
    return 'ConfirmationMailShopkeeper';
  }

  async handle({ data }) {
    const { shopkeeper } = data;

    await Mail.sendMail({
      to: `${shopkeeper.employee} <${shopkeeper.email}>`,
      subject: 'Cadastramento realizado',
      template: 'ConfirmationShopkeeper',
      context: {
        name: shopkeeper.employee,
        password_hash: shopkeeper.password_hash,
      },
    })
      .then(message => {
        console.log(message);
      })
      .catch(e => {
        console.log(e);
      });
  }
}

export default new ConfirmationMailShopkeeper();
