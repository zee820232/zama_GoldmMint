import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Hammer, Coins, Shield, Lock, Cpu, Zap, Star } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zama-dark-900 via-zama-dark-700 to-zama-dark-900 relative overflow-hidden">
      {/* 科技感背景网格 */}
      <div className="absolute inset-0 bg-tech-grid-gold opacity-20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zama-gold-500/10 rounded-full blur-3xl animate-goldPulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zama-orange/10 rounded-full blur-3xl animate-goldPulse animation-delay-300" />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="p-6 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 rounded-full animate-goldPulse shadow-gold-glow">
              <Hammer className="w-20 h-20 text-white animate-goldFloat" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-zama-gold-400 to-zama-amber bg-clip-text text-transparent">
            Zama 矿工游戏
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            基于 Zama FHE 技术的完全保密链上挖矿游戏
            <br />
            <span className="text-zama-gold-300">您的收益、幸运值、掉落记录完全加密,只有您能看到</span>
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/mint">
              <Button size="lg" variant="primary" className="group">
                开始游戏
                <Hammer className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </Button>
            </Link>
            <a href="https://docs.zama.ai" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                了解 Zama FHE
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">核心特性</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card variant="tech" className="border-2 border-zama-gold-500/30 hover:border-zama-gold-400/50 transition-all">
            <CardContent>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">完全保密</h3>
                <p className="text-gray-300">
                  所有关键数据都使用 FHE 全同态加密,包括幸运值、收益、掉落记录。只有您能查看自己的数据。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="tech" className="border-2 border-zama-gold-500/30 hover:border-zama-gold-400/50 transition-all">
            <CardContent>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 rounded-full animate-goldPulse">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">公平随机</h3>
                <p className="text-gray-300">
                  使用链上 FHE 随机数生成器,保证每次挖矿结果完全随机且无法被预测或操纵。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="tech" className="border-2 border-zama-gold-500/30 hover:border-zama-gold-400/50 transition-all">
            <CardContent>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">可验证安全</h3>
                <p className="text-gray-300">
                  基于以太坊智能合约,所有规则透明可验证。结合 FHE 加密,实现安全与隐私的完美平衡。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it Works */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">游戏流程</h2>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-start gap-4 p-6 bg-zama-dark-800/50 backdrop-blur-sm rounded-xl border border-zama-gold-500/30">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-gold-glow">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Hammer className="w-5 h-5 text-zama-gold-400" />
                铸造锄头 NFT
              </h3>
              <p className="text-gray-300">
                选择锄头等级(1-5),支付入场费铸造您的专属锄头。高等级锄头有更好的属性和更高的稀有掉落概率。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-zama-dark-800/50 backdrop-blur-sm rounded-xl border border-zama-gold-500/30">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-gold-glow">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-zama-gold-400" />
                开始挖矿
              </h3>
              <p className="text-gray-300">
                使用锄头挖矿,每次消耗 10 耐久。根据随机掉落获得普通/稀有/史诗奖励。所有数据加密,只有您知道获得了什么。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-zama-dark-800/50 backdrop-blur-sm rounded-xl border border-zama-gold-500/30">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-gold-glow">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-zama-gold-400" />
                领取奖励
              </h3>
              <p className="text-gray-300">
                累积足够收益后,通过前端重加密查看余额,然后领取 GOLD 代币和稀有物品。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-zama-dark-800/50 backdrop-blur-sm rounded-xl border border-zama-gold-500/30">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-zama-gold-500 to-zama-gold-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-gold-glow">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-zama-gold-400" />
                修复与升级
              </h3>
              <p className="text-gray-300">
                使用 GOLD 代币修复锄头耐久(30% 燃烧通缩)。使用稀有物品获得临时加成。
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/mint">
            <Button size="lg" variant="primary" className="group px-8 py-4 text-lg">
              立即开始挖矿
              <Star className="w-5 h-5 ml-2 group-hover:animate-pulse" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zama-dark-900/80 backdrop-blur-sm text-white py-8 border-t border-zama-gold-500/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Powered by{' '}
            <a
              href="https://zama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zama-gold-400 hover:underline"
            >
              Zama FHE
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            完全保密 · 公平随机 · 可验证安全
          </p>
        </div>
      </footer>
    </div>
  );
}