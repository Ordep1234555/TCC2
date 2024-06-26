import React from 'react';
import ReactDOM from 'react-dom/client';
import Graph from './Graph.tsx';

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const App: React.FC = () => {
  return (
    <div>
      <h1>Gráfico de Mestrado e Doutorado por Ano</h1>
    </div>
  );
};

export default App;

root.render(<React.StrictMode><Graph/></React.StrictMode>);