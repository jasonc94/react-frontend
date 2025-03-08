import { Route, Routes } from 'react-router-dom';
import { Home } from '@JC/home';

const StockPage = () => <h1>Stock Page</h1>;
const DetailsPage = () => <h1>Details Page</h1>;
export function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/stock" element={<StockPage />} />
      <Route path="/stock/:stockId" element={<DetailsPage />} />
    </Routes>
  );
}

export default AppRouting;
