import Mail from '../../lib/Mail';

class ConfirmationMailUser {
  get key() {
    return 'ConfirmationMailUser';
  }

  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Cadastramento realizado',
      template: 'Confirmation',
      context: {
        name: user.name,
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

export default new ConfirmationMailUser();
