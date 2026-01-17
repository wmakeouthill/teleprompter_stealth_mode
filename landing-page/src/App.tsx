import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer } from '@/shared/components';
import { HomePage } from '@/features/home';
import { InstructionsPage } from '@/features/instructions';

import '@/styles/index.css';

function App() {
  return (
    <BrowserRouter basename="/teleprompter_stealth_mode">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
