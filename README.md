<h1 align="center">
    Aplication coltech
    <br>
</h1>

<h1 align="center">
   Aplication coltech backend and frontend
</h1>

<h4 align="center">
  Sistema de armazenamento de laudos tecnicos e controle.
</h4>

<p align="center">
<img alt="Last commit on GitHub" src="https://img.shields.io/github/last-commit/joaomenna1/COLTECH?color=7159C1">
<img alt="Made by Joao nogueira" src="https://img.shields.io/badge/made%20by-joaomenna1-%20?color=7159C1">
<img alt="Project top programing language" src="https://img.shields.io/github/languages/top/joaomenna1/COLTECH?color=7159C1">
<img alt="GitHub license" src="https://img.shields.io/github/license/joaomenna1/COLTECH?color=7159C1">
</p> 

<p align="center">
  <a href="#rocket-built-with">Built with</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-run">How to run</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#page_facing_up-license">Licence</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#mailbox_with_mail-get-in-touch">Get in touch</a>
</p>
<br><br>

## :rocket: Built with

This project was developed with the following technologies:

-  [Node.js](https://nodejs.org/)
-  [Express](https://expressjs.com/)
-  [axios](https://github.com/axios/axios)
-  [Jest](https://jestjs.io/)
-  [VS Code](https://code.visualstudio.com/)

## :information_source: How to run
### Requirements
To run the app, you will need [Git](https://git-scm.com), [Node.js](https://nodejs.org/) v12.13.1 or higher, [Yarn](https://yarnpkg.com/).
<br>

### Backend
Now clone the repository and install the dependencies.
```bash
# to clone the repository
git clone https://github.com/joaomenna1/COLTECH.git

# go into the backend folder
cd COLTECH/backend

#install the backend dependencies
yarn or npm install

```
In order to connect to the database, you will need to enter the access informations into a .env file, based on a .env.example file that is provided in the backend folder, change the variables according to your environment.
```bash
# run migrations
yarn sequelize db:migrate
  &
npx run sequelize sequelize db:migrate


# run api
yarn dev & npm run dev
```
### Frontend

```bash
# in another tab of the terminal install the frontend dependencies and run it 
cd frontend
yarn or npm install
yarn start or npm run start
```
Use this credentials to access the web application
<blockquote><strong>email:</strong> admin@coltech.com</blockquote>
<blockquote> <strong>senha:</strong> 123456</blockquote>
---

## :page_facing_up: License

This project is under the MIT license. See the [LICENSE](https://github.com/joaomenna1/COLTECH/blob/master/LICENSE) for more information


## :mailbox_with_mail: Get in touch!

[LinkedIn](https://linkedin.com/in/nogueira-menna-barreto)

---

Made with :coffee: and ♥ by Jamelão.
