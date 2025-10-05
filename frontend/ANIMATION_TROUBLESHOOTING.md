# 🎨 动画效果故障排查指南

## 问题: "为什么我看到的还是文字页面"

### 快速检查清单

- [ ] 1. 访问正确的端口: **http://localhost:3001** (不是 3000)
- [ ] 2. 访问铸造页面: **http://localhost:3001/mint**
- [ ] 3. 强制刷新浏览器: `Ctrl + Shift + R` (Windows) 或 `Cmd + Shift + R` (Mac)
- [ ] 4. 检查浏览器控制台没有错误 (F12)

---

## 应该看到的动画效果

### 铸造页面 (http://localhost:3001/mint)

#### 页面加载时
1. **背景**
   - 深色渐变: 从深蓝黑 → 深灰蓝 → 深蓝黑
   - 两个浮动光球缓慢脉冲 (左上和右下)

2. **标题区域** (页面顶部)
   - 整个区域淡入 (从透明到不透明)
   - 🔨 Hammer 图标上下弹跳
   - 白色大标题 "铸造锄头"

3. **5 个锄头卡片**
   - 依次出现 (每个间隔 100ms)
   - 从缩小状态放大到正常
   - 每个卡片有不同颜色:
     - 等级 1: 灰色边框
     - 等级 2: 绿色边框
     - 等级 3: 蓝色边框
     - 等级 4: 紫色边框
     - 等级 5: 金色边框 + 发光脉冲

#### 交互动画
1. **悬停卡片**
   - 卡片轻微放大 (scale: 1.02)
   - 阴影增强

2. **点击选中**
   - 卡片放大 (scale: 1.05)
   - 出现选中勾号 (✓)
   - 边框发光

3. **铸造中**
   - 锤子图标旋转
   - 按钮文字变为 "铸造中..."

4. **铸造成功**
   - 绿色成功横幅弹出
   - ✨🎉 表情符号弹跳

---

## 故障排查步骤

### 步骤 1: 确认服务器运行

打开终端,确认看到:
```
VITE v5.4.20  ready in XXX ms

➜  Local:   http://localhost:3001/
```

### 步骤 2: 检查浏览器兼容性

**支持的浏览器**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**不支持**:
- ❌ IE 11 及以下

### 步骤 3: 检查浏览器控制台

1. 按 `F12` 打开开发者工具
2. 切换到 **Console** 标签
3. 查找红色错误信息

**常见错误**:

#### 错误 1: CSS 未加载
```
Failed to load resource: the server responded with a status of 404
```
**解决**: 重启开发服务器
```bash
cd frontend
npm run dev
```

#### 错误 2: JavaScript 错误
```
Uncaught TypeError: Cannot read property 'xxx' of undefined
```
**解决**: 检查浏览器控制台完整错误堆栈,可能需要更新代码

#### 错误 3: 网络连接问题
```
Failed to fetch
```
**解决**: 确认开发服务器正在运行

### 步骤 4: 检查 CSS 是否生效

1. 打开开发者工具 (F12)
2. 切换到 **Elements** 标签
3. 选中页面上的任意元素
4. 在右侧 **Computed** 标签页查看样式
5. 查找 `animation` 属性是否存在

**示例 - 标题应该有**:
```css
animation: fadeIn 0.6s ease-out forwards;
```

### 步骤 5: 检查 Tailwind 配置

在开发者工具 Console 运行:
```javascript
document.querySelector('.animate-fadeIn')
```

应该返回 DOM 元素,而不是 `null`。

---

## 常见问题

### Q1: 页面是白色的,没有深色背景
**原因**: CSS 可能未加载或 Tailwind 未编译
**解决**:
```bash
cd frontend
rm -rf node_modules/.vite  # 清除 Vite 缓存
npm run dev
```

### Q2: 卡片没有颜色区分
**原因**: Tailwind 自定义颜色未生效
**检查**: `tailwind.config.js` 中 `extend.colors.rarity` 是否存在

### Q3: 动画不流畅/卡顿
**原因**: 浏览器性能或硬件加速未启用
**解决**:
1. 关闭其他占用资源的标签页
2. 启用浏览器硬件加速:
   - Chrome: 设置 → 系统 → 使用硬件加速
   - Firefox: 选项 → 性能 → 使用推荐的性能设置

### Q4: 只有部分动画工作
**原因**: 浏览器限制了动画数量或 `prefers-reduced-motion` 启用
**检查**:
```javascript
// 在控制台运行
window.matchMedia('(prefers-reduced-motion: reduce)').matches
```
如果返回 `true`,在系统设置中禁用 "减少动画" 选项。

---

## 手动验证动画

### 测试 1: 淡入动画
在浏览器控制台运行:
```javascript
document.querySelector('.animate-fadeIn').style.animation
```
应该输出: `"0.6s ease-out 0s 1 normal forwards running fadeIn"`

### 测试 2: 弹跳动画
```javascript
document.querySelector('.animate-bounce').style.animation
```
应该输出包含 `bounce` 的字符串

### 测试 3: 发光脉冲 (等级 5 锄头)
访问铸造页面,等级 5 锄头的中心图标应该有缓慢的呼吸发光效果。

---

## 仍然无法解决?

### 提供以下信息以便诊断:

1. **浏览器**: 名称和版本 (Chrome 120, Firefox 119, etc.)
2. **操作系统**: Windows 10/11, macOS, Linux
3. **控制台错误**: 完整的错误信息截图
4. **网络标签**: 开发者工具 → Network,筛选 CSS 文件,查看是否全部加载 (状态码 200)
5. **访问的 URL**: 完整地址
6. **重现步骤**: 详细描述您的操作流程

### 临时调试方案

创建一个最小测试页面:

```html
<!-- 在 frontend/public/test.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .test {
      animation: fadeIn 2s ease-out;
      font-size: 48px;
      text-align: center;
      margin-top: 100px;
    }
  </style>
</head>
<body>
  <div class="test">🎉 如果您能看到这段文字淡入,说明浏览器支持动画!</div>
</body>
</html>
```

访问 http://localhost:3001/test.html

如果这个简单动画都不工作,问题在浏览器设置或兼容性。

---

## 最佳实践

1. **始终使用最新浏览器**: Chrome 120+, Firefox 120+
2. **启用硬件加速**: 提升动画性能
3. **定期清除缓存**: 避免旧版本 CSS/JS 残留
4. **使用开发者工具**: 实时查看样式和动画状态

---

**更新时间**: 2025-10-05
**适用版本**: Zama Mining Game Frontend v1.0.0
