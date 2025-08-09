import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/client';
import ChatApp from './components/ChatApp';

const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="app">
        <ChatApp />
      </div>
    </ApolloProvider>
  );
};

export default App;