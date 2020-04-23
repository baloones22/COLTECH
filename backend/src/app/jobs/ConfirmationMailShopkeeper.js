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
      template: 'Confirmation',
      context: {
        name: shopkeeper.employee,
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
