import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { config } from './utils/wagmi';
import { HomePage } from './pages/HomePage';
import { MinePage } from './pages/MinePage';
import { MintPage } from './pages/MintPage';
import { InventoryPage } from './pages/InventoryPage';
import { RewardsPage } from './pages/RewardsPage';
import { ParticleBackground } from './components/ParticleBackground';
import { Hammer, Home, Package, Coins, Cpu } from 'lucide-react';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-900 relative">
              <ParticleBackground />
              <Navigation />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/mine" element={<MinePage />} />
                  <Route path="/mint" element={<MintPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/rewards" element={<RewardsPage />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Navigation() {
  return (
    <nav className="bg-zama-dark-900/80 backdrop-blur-md border-b border-zama-gold-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="p-1 rounded-lg bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 animate-goldPulse shadow-gold-glow">
              <Hammer className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-zama-gold-400 to-zama-amber bg-clip-text text-transparent">
              Zama Miner
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={<Home className="w-4 h-4" />}>
              首页
            </NavLink>
            <NavLink to="/mint" icon={<Hammer className="w-4 h-4" />}>
              铸造
            </NavLink>
            <NavLink to="/mine" icon={<Hammer className="w-4 h-4" />}>
              挖矿
            </NavLink>
            <NavLink to="/inventory" icon={<Package className="w-4 h-4" />}>
              背包
            </NavLink>
            <NavLink to="/rewards" icon={<Coins className="w-4 h-4" />}>
              奖励
            </NavLink>
          </div>

          {/* Connect Button */}
          <div className="bg-zama-dark-800/50 backdrop-blur-sm rounded-full p-1 border border-zama-gold-500/30">
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 text-gray-300 hover:text-zama-gold-400 transition-all duration-300 group"
    >
      <div className="p-1 rounded-md group-hover:bg-zama-gold-500/20 transition-colors">
        {icon}
      </div>
      <span className="group-hover:text-zama-gold-400">{children}</span>
      <div className="w-0 group-hover:w-2 h-0.5 bg-zama-gold-400 transition-all duration-300" />
    </Link>
  );
}

export default App;