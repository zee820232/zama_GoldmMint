# Zama 挖矿游戏 - UI/UX 设计系统文档

## 📋 概述

本文档定义了 Zama FHE 挖矿游戏的完整视觉设计系统,包括颜色、动画、间距、字体等规范。

---

## 🎨 颜色系统

### 主题色板

#### 锄头等级颜色(稀有度)
```css
Lv.1 普通 (Common):    #6B7280 → #4B5563 (灰色)
Lv.2 优良 (Uncommon):  #10B981 → #059669 (绿色)
Lv.3 稀有 (Rare):      #3B82F6 → #2563EB (蓝色)
Lv.4 史诗 (Epic):      #A855F7 → #9333EA (紫色)
Lv.5 传说 (Legendary): #F59E0B → #D97706 (金色)
```

#### 游戏主题颜色
```css
金币色:       #FCD34D
矿洞深色:     #0F172A (背景深色)
矿洞中色:     #1E293B (卡片背景)
矿洞亮色:     #334155 (边框)
成功绿:       #10B981
警告红:       #EF4444
加密紫:       #A855F7
```

#### Primary 色板
```css
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9
primary-600: #0284c7 (主要使用)
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
```

---

## ✨ 动画系统

### 动画时长规范
```css
快速交互:   150ms  (按钮按下、悬停)
标准过渡:   300ms  (卡片悬停、展开)
慢速展示:   600ms  (页面加载、卡片进场)
持续动画:   2-3s   (背景粒子、光晕脉冲)
```

### 核心动画

#### 1. 页面进场动画
- **fadeIn**: 淡入 + 向上滑动 (0.6s)
- **slideInLeft**: 从左侧滑入 (0.6s)
- **slideInRight**: 从右侧滑入 (0.6s)
- **scaleIn**: 缩放进场 (0.4s)

**使用方式:**
```tsx
<div className="animate-fadeIn">内容</div>
<div className="animate-scaleIn animation-delay-200">延迟进场</div>
```

#### 2. 挖矿动画
- **mining**: 锄头摆动动画 (0.6s)
- **miningShake**: 整体震动效果 (0.5s)
- **miningPulse**: 脉冲光效 (1s)

**使用场景:**
- 点击挖矿按钮时触发
- 锄头图标摆动
- 卡片震动反馈

#### 3. 光晕/发光效果
- **glow**: 持续光晕闪烁 (2s infinite)
- **glowPulse**: 脉冲发光 (2s infinite)
- **borderGlow**: 边框发光动画 (2s infinite)

**使用场景:**
- 高等级锄头(Lv.4+)
- 传说级物品
- 强调重要按钮

#### 4. 卡片效果
- **cardFloat**: 悬浮浮动 (3s infinite)
- **card-3d**: 3D 倾斜效果(悬停触发)
- **shine-effect**: 光泽划过效果

#### 5. 成功/奖励动画
- **celebrate**: 庆祝弹出 (0.6s)
- **coinFlip**: 金币翻转 (1s)
- **confetti**: 彩纸飘落

---

## 📐 间距系统

### Tailwind 间距规范
```css
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
3xl: 4rem    (64px)
```

### 组件内边距
```css
Card:           p-6  (24px)
Button Small:   px-3 py-1.5
Button Medium:  px-4 py-2
Button Large:   px-6 py-3
```

---

## 🔤 字体系统

### 字体族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

### 字号规范
```css
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
text-5xl:  3rem     (48px)
```

### 字重
```css
font-medium:   500
font-semibold: 600
font-bold:     700
```

---

## 🎯 组件设计规范

### Button 组件

#### 变体
- **primary**: 主要操作(蓝色渐变)
- **secondary**: 次要操作(灰色渐变)
- **outline**: 边框样式
- **ghost**: 透明背景
- **danger**: 危险操作(红色)
- **success**: 成功操作(绿色)
- **gold**: 特殊操作(金色渐变,带动画)

#### 尺寸
```tsx
sm: 小按钮 (px-3 py-1.5 text-sm)
md: 中按钮 (px-4 py-2 text-base)
lg: 大按钮 (px-6 py-3 text-lg)
```

#### 特殊属性
- `glow`: 添加发光效果
- `loading`: 加载状态(带旋转图标)

**示例:**
```tsx
<Button variant="gold" size="lg" glow>
  立即铸造
</Button>
```

---

### Card 组件

#### 变体
- **default**: 纯白背景
- **bordered**: 白色 + 灰色边框
- **elevated**: 白色 + 阴影
- **glass**: 毛玻璃效果(半透明 + 背景模糊)
- **dark**: 深色主题(矿洞风格)

#### 特殊属性
- `hover3d`: 悬停 3D 倾斜效果
- `glow`: 稀有度光晕

**示例:**
```tsx
<Card variant="dark" hover3d glow>
  内容
</Card>
```

---

### PickaxeCard 组件

#### 等级视觉差异

| 等级 | 颜色 | 特效 |
|------|------|------|
| Lv.1 | 灰色 | 无 |
| Lv.2 | 绿色 | 无 |
| Lv.3 | 蓝色 | 无 |
| Lv.4 | 紫色 | 发光动画 |
| Lv.5 | 金色 | 发光 + 边框闪烁 |

#### 状态效果
- **正常**: 悬停 3D 倾斜
- **挖矿中**: 震动 + 脉冲光效
- **耐久不足**: 红色警告框 + 脉冲

---

## 📄 页面设计规范

### MintPage (铸造页面)

#### 布局结构
```
┌─────────────────────────────────────────┐
│  [深色渐变背景 + 矿洞纹理]              │
│  ┌─────────────────────────────────┐    │
│  │  [标题区 - 居中 - 带动画]      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [5个等级卡片 - 网格布局 - 交错动画]   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
│  │Lv1│ │Lv2│ │Lv3│ │Lv4│ │Lv5│        │
│  └───┘ └───┘ └───┘ └───┘ └───┘        │
│                                         │
│  [说明卡片 - 毛玻璃效果]                │
└─────────────────────────────────────────┘
```

#### 视觉特点
- 深色背景(#0F172A → #1E293B)
- 浮动光球装饰(蓝色/紫色)
- 卡片选中时:放大 + 发光边框
- 高等级卡片有光泽划过效果

---

### MinePage (挖矿页面)

#### 关键动画
- 点击挖矿:锄头摆动 + 卡片震动
- 进度条闪光效果
- 高等级锄头持续发光

---

### InventoryPage (背包页面)

#### 视觉要求
- NFT 卡片网格布局
- 悬停放大(scale-105)
- 稀有物品对应稀有度光效

---

### RewardsPage (奖励页面)

#### 特殊效果
- 领取成功:庆祝动画 + 金币翻转
- 加密数据显示遮罩效果
- 提示框渐入动画

---

## 🎭 特殊效果类

### 稀有度光效
```css
.rarity-common    { --glow-color: #6B7280; }
.rarity-uncommon  { --glow-color: #10B981; }
.rarity-rare      { --glow-color: #3B82F6; }
.rarity-epic      { --glow-color: #A855F7; }
.rarity-legendary { --glow-color: #F59E0B; }

.rarity-glow {
  box-shadow: 0 0 10px var(--glow-color),
              0 0 20px var(--glow-color),
              0 0 30px var(--glow-color),
              inset 0 0 10px var(--glow-color);
}
```

### 3D 卡片效果
```css
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.card-3d:hover {
  transform: perspective(1000px)
             rotateX(2deg)
             rotateY(5deg)
             scale(1.05);
}
```

### 光泽效果
```css
.shine-effect {
  position: relative;
  overflow: hidden;
}

.shine-effect::after {
  /* 光泽从左滑到右 */
  background: linear-gradient(45deg,
    transparent,
    rgba(255,255,255,0.1),
    transparent);
}
```

---

## ♿ 可访问性

### 动画偏好设置
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 对比度要求
- 文字对比度 >= 4.5:1
- 按钮焦点清晰可见
- 禁用状态明显(opacity: 0.5)

---

## 🚀 性能优化

### 动画优化原则
1. 优先使用 `transform` 和 `opacity`(GPU 加速)
2. 避免动画 `width`、`height`、`margin`
3. 使用 `will-change` 提示浏览器优化
4. 避免过多同时运行的动画

### 示例
```css
/* ✅ 推荐 */
.animate-slide {
  transform: translateX(0);
  transition: transform 0.3s;
}

/* ❌ 不推荐 */
.animate-slide {
  left: 0;
  transition: left 0.3s;
}
```

---

## 📦 使用示例

### 完整页面示例
```tsx
<div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
  {/* 背景装饰 */}
  <div className="absolute inset-0 bg-mine-texture opacity-5" />

  {/* 标题 - 带动画 */}
  <div className="animate-fadeIn">
    <h1 className="text-5xl font-bold text-white">
      铸造锄头
    </h1>
  </div>

  {/* 卡片网格 - 交错动画 */}
  <div className="grid lg:grid-cols-3 gap-6">
    {items.map((item, index) => (
      <div
        key={item.id}
        className="animate-scaleIn"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Card variant="dark" hover3d>
          {/* 内容 */}
        </Card>
      </div>
    ))}
  </div>
</div>
```

---

## 🔧 开发工具

### Tailwind 配置文件
位置: `E:\WEB\zama\frontend\tailwind.config.js`

### 动画样式文件
位置: `E:\WEB\zama\frontend\src\styles\animations.css`

### 主样式文件
位置: `E:\WEB\zama\frontend\src\index.css`

---

## 📝 更新日志

### v1.0.0 - 2025-10-05
- ✅ 创建完整动画系统
- ✅ 定义锄头等级颜色方案
- ✅ 优化 Button 组件(新增 gold 变体)
- ✅ 优化 Card 组件(新增 glass/dark 变体)
- ✅ 重构 PickaxeCard(等级视觉差异)
- ✅ 重构 MintPage(深色主题 + 动画)
- ✅ 添加 3D 效果和光泽效果
- ✅ 支持无障碍访问(prefers-reduced-motion)

---

## 🎯 下一步计划

1. **粒子系统**(可选):背景浮动金币/矿石粒子
2. **音效集成**:点击、挖矿、领取奖励音效
3. **主题切换**:支持亮色/暗色主题切换
4. **响应式优化**:移动端适配

---

**设计者**: Claude (AI UI/UX Designer)
**项目**: Zama FHE Mining Game
**最后更新**: 2025-10-05
