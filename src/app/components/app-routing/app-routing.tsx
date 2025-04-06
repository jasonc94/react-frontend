import { Route, Routes } from 'react-router-dom';
import { Home } from '@JC/home';
import { SquadLobby, SquadRoom } from '@JC/webrtc/ui';
import { GameLibrary } from '@JC/games/game-library';
import { Tutorials } from '@JC/tutorials';

const StockPage = () => <h1>Stock Page</h1>;
const DetailsPage = () => <h1>Details Page</h1>;
export function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/stock" element={<StockPage />} />
      <Route path="/stock/:stockId" element={<DetailsPage />} />
      <Route path="/games" element={<GameLibrary />}></Route>
      <Route path="/squad-connect" element={<SquadLobby />}></Route>
      <Route path="/squad-connect/:room" element={<SquadRoom />}></Route>
      <Route path="/tutorials" element={<Tutorials />}></Route>
    </Routes>
  );
}

export default AppRouting;
