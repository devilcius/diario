import React from 'react';
import EntryList from '../components/EntryList';
import { t } from 'i18next';

const EntriesPage = () => {
  return (
    <div>
      <h1>{t('entry-list-title')}</h1>
      <EntryList />
    </div>
  );
};

export default EntriesPage;