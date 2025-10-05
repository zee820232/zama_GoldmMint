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
import { Hammer, Home, Package, Coins, Cpu, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-zama-dark-900/80 backdrop-blur-md border-b border-zama-gold-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-base md:text-xl text-white">
            <div className="p-1 rounded-lg bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 animate-goldPulse shadow-gold-glow">
              <Hammer className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-zama-gold-400 to-zama-amber bg-clip-text text-transparent">
              Zama Miner
            </span>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Desktop Connect Button */}
          <div className="hidden md:block bg-zama-dark-800/50 backdrop-blur-sm rounded-full p-1 border border-zama-gold-500/30">
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zama-dark-800/50 border border-zama-gold-500/30 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zama-gold-500/30 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <MobileNavLink to="/" icon={<Home className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                首页
              </MobileNavLink>
              <MobileNavLink to="/mint" icon={<Hammer className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                铸造
              </MobileNavLink>
              <MobileNavLink to="/mine" icon={<Hammer className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                挖矿
              </MobileNavLink>
              <MobileNavLink to="/inventory" icon={<Package className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                背包
              </MobileNavLink>
              <MobileNavLink to="/rewards" icon={<Coins className="w-5 h-5" />} onClick={() => setMobileMenuOpen(false)}>
                奖励
              </MobileNavLink>

              {/* Mobile Connect Button */}
              <div className="mt-4 bg-zama-dark-800/50 backdrop-blur-sm rounded-lg p-1 border border-zama-gold-500/30">
                <ConnectButton
                  showBalance={false}
                  chainStatus="icon"
                />
              </div>
            </div>
          </div>
        )}
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

function MobileNavLink({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zama-dark-800/50 border border-zama-gold-500/20 text-white hover:border-zama-gold-500/50 hover:bg-zama-dark-700/50 transition-all duration-300 min-h-[44px]"
    >
      <div className="p-1.5 rounded-md bg-zama-gold-500/20">
        {icon}
      </div>
      <span className="text-base font-medium">{children}</span>
    </Link>
  );
}

export default App;