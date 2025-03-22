import { Route, Routes } from 'react-router-dom';
import { Home } from '@JC/home';
import { Game2048 } from '@JC/games/game-2048';
import { SquadLobby, SquadRoom } from '@JC/webrtc/ui';

const StockPage = () => <h1>Stock Page</h1>;
const DetailsPage = () => <h1>Details Page</h1>;
export function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/stock" element={<StockPage />} />
      <Route path="/stock/:stockId" element={<DetailsPage />} />
      <Route path="/games" element={<Game2048 />}></Route>
      <Route path="/squad-connect" element={<SquadLobby />}></Route>
      <Route path="/squad-connect/:room" element={<SquadRoom />}></Route>
    </Routes>
  );
}

export default AppRouting;
