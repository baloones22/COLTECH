import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';
import shopkeeper from '~/pages/shopkeeper';
import ManageShopkeeper from '~/pages/shopkeeper/ManageShopkeeper';
import Document from '~/pages/Document';
import ManageDocuments from '~/pages/Document/ManageDocuments';
import Memberships from '~/pages/Memberships';
import ManageMembership from '~/pages/Memberships/ManageMembership';
import HelpOrders from '~/pages/HelpOrders';
import Profile from '~/pages/Profile';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/shopkeeper" exact component={shopkeeper} isPrivate />
      <Route path="/shopkeeper/new" component={ManageShopkeeper} isPrivate />
      <Route path="/shopkeeper/:id" component={ManageShopkeeper} isPrivate />

      <Route path="/documents" exact component={Document} isPrivate />
      <Route path="/documents/new" component={ManageDocuments} isPrivate />
      <Route path="/documents/:id" component={ManageDocuments} isPrivate />

      <Route path="/memberships" exact component={Memberships} isPrivate />
      <Route path="/memberships/new" component={ManageMembership} isPrivate />
      <Route
        path="/memberships/:shopkeeperId"
        component={ManageMembership}
        isPrivate
      />

      <Route path="/helporders" component={HelpOrders} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />

    </Switch>
  );
};

export default Routes;
