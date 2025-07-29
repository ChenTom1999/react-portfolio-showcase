import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// 🎯 Header 組件 - 展示個人資訊
function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div className="profile">
        <h1>🚀 我的技能學習之旅</h1>
        <p>正在學習: JavaScript ES6+ → React → Next.js → MongoDB</p>
        <p>當前時間: {currentTime.toLocaleTimeString()}</p>
      </div>
    </header>
  );
}

// 🎯 Counter 組件 - 展示 useState
function Counter() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('開始計數吧！');

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setMessage(`你已經點擊了 ${count + 1} 次！`);
  };

  const handleReset = () => {
    setCount(0);
    setMessage('重新開始！');
  };

  return (
    <div className="counter">
      <h2>🔢 計數器組件</h2>
      <div className="count-display">{count}</div>
      <p>{message}</p>
      <div className="counter-buttons">
        <button onClick={handleIncrement} className="btn-primary">
          增加 +1
        </button>
        <button onClick={handleReset} className="btn-secondary">
          重置
        </button>
      </div>
    </div>
  );
}

// 🎯 TodoList 組件 - 展示狀態管理
// 🎯 進階 TodoList 組件 - 加入數據持久化
function TodoList() {
  // 從 localStorage 讀取初始數據
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('learningTodos');
    return savedTodos ? JSON.parse(savedTodos) : [
      { id: 1, text: '學習 JavaScript ES6+', completed: true, createdAt: new Date().toISOString() },
      { id: 2, text: '掌握 React 基礎', completed: false, createdAt: new Date().toISOString() },
      { id: 3, text: '建立個人作品集', completed: false, createdAt: new Date().toISOString() }
    ];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // 每當 todos 改變時，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('learningTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // 過濾邏輯
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-list">
      <h2>📝 學習進度清單 <span className="todo-badge">進階版</span></h2>
      
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新增學習目標..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="btn-primary">
          ➕ 新增
        </button>
      </div>

      {/* 過濾器按鈕 */}
      <div className="todo-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部 ({todos.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          進行中 ({activeCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          已完成 ({completedCount})
        </button>
      </div>

      <ul className="todos">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <span
                onClick={() => toggleTodo(todo.id)}
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  flex: 1
                }}
              >
                {todo.completed ? '✅' : '⏳'} {todo.text}
              </span>
              <small className="todo-date">
                {new Date(todo.createdAt).toLocaleDateString('zh-TW')}
              </small>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn-delete"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <div className="empty-state">
          <p>🎯 {filter === 'all' ? '還沒有任何任務' : `沒有${filter === 'active' ? '進行中' : '已完成'}的任務`}</p>
        </div>
      )}
      
      <div className="todo-stats">
        <div className="stats-left">
          <strong>進度統計:</strong> 完成 {completedCount} / {todos.length} 項任務
        </div>
        <div className="stats-right">
          {completedCount > 0 && (
            <button onClick={clearCompleted} className="btn-clear">
              清除已完成
            </button>
          )}
        </div>
      </div>

      {/* 進度圓圈 */}
      <div className="progress-circle">
        <div className="circle-progress">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path className="circle"
              strokeDasharray={`${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">
              {todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// 🌤️ 天氣組件 - 修復 ESLint 警告
function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('台北');

  // 🔧 使用 useCallback 優化 fetchWeather 函數
  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWeatherData = {
        '台北': { temp: 25, desc: '多雲', humidity: 65, wind: 8 },
        '高雄': { temp: 28, desc: '晴朗', humidity: 70, wind: 6 },
        '台中': { temp: 24, desc: '陰天', humidity: 72, wind: 5 },
        '台南': { temp: 27, desc: '小雨', humidity: 78, wind: 7 }
      };
      
      const data = mockWeatherData[cityName];
      if (!data) {
        throw new Error('找不到該城市的天氣資料');
      }
      
      setWeather({
        city: cityName,
        temperature: data.temp,
        description: data.desc,
        humidity: data.humidity,
        windSpeed: data.wind,
        icon: getWeatherIcon(data.desc),
        timestamp: new Date().toLocaleString('zh-TW')
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // fetchWeather 不依賴於任何 props 或 state

  const getWeatherIcon = (desc) => {
    const icons = {
      '晴朗': '☀️',
      '多雲': '⛅',
      '陰天': '☁️',
      '小雨': '🌦️',
      '大雨': '🌧️',
      '雷雨': '⛈️'
    };
    return icons[desc] || '🌤️';
  };

  // 🔧 修復：添加正確的依賴項
  useEffect(() => {
    fetchWeather(city);
  }, [city, fetchWeather]);

  const handleCityChange = (newCity) => {
    setCity(newCity);
    // 不需要手動調用 fetchWeather，useEffect 會自動處理
  };

  const getWeatherTip = (desc, temp) => {
    if (desc.includes('雨')) return '記得帶雨傘！適合在室內學習程式設計 🏠';
    if (temp > 30) return '天氣很熱，多喝水保持專注力 💧';
    if (temp < 15) return '天氣涼爽，很適合專心學習新技術 📚';
    if (desc === '晴朗') return '天氣很好！學習完可以出去走走放鬆一下 ☀️';
    return '無論天氣如何，持續學習才是關鍵！💪';
  };

  return (
    <div className="weather">
      <h2>🌤️ 天氣資訊</h2>
      
      <div className="city-selector">
        <p>選擇城市：</p>
        <div className="city-buttons">
          {['台北', '高雄', '台中', '台南'].map(cityName => (
            <button
              key={cityName}
              className={`city-btn ${city === cityName ? 'active' : ''}`}
              onClick={() => handleCityChange(cityName)}
              disabled={loading}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>

      <div className="weather-display">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>🔄 正在獲取天氣資料...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ 錯誤: {error}</p>
            <button 
              onClick={() => fetchWeather(city)} 
              className="btn-primary"
            >
              🔄 重新嘗試
            </button>
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-card">
            <div className="weather-header">
              <h3>{weather.icon} {weather.city}</h3>
              <p className="weather-time">更新時間: {weather.timestamp}</p>
            </div>
            
            <div className="weather-main">
              <div className="temperature">
                <span className="temp-value">{weather.temperature}</span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="weather-desc">{weather.description}</div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-label">濕度</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-label">風速</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
            </div>

            <div className="weather-tips">
              <h4>💡 今日建議</h4>
              <p>{getWeatherTip(weather.description, weather.temperature)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎯 SkillProgress 組件 - 展示學習進度
function SkillProgress() {
  const [skills, setSkills] = useState([
    { name: 'JavaScript ES6+', progress: 85, color: '#f7df1e' },
    { name: 'React', progress: 40, color: '#61dafb' },
    { name: 'Next.js', progress: 10, color: '#000000' },
    { name: 'MongoDB', progress: 5, color: '#47a248' }
  ]);

  useEffect(() => {
    // 模擬進度增長
    const timer = setTimeout(() => {
      setSkills(prev => prev.map(skill => ({
        ...skill,
        progress: skill.name === 'React' ? Math.min(skill.progress + 20, 100) : skill.progress
      })));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-progress">
      <h2>📊 技能掌握度</h2>
      {skills.map(skill => (
        <div key={skill.name} className="skill-item">
          <div className="skill-header">
            <span>{skill.name}</span>
            <span>{skill.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${skill.progress}%`,
                backgroundColor: skill.color,
                transition: 'width 1s ease-in-out'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 🎯 主要 App 組件
function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'counter':
        return <Counter />;
      case 'todos':
        return <TodoList />;
      case 'skills':
        return <SkillProgress />;
      case 'weather':
        return <Weather />;
      default:
        return (
          <div className="home">
            <h2>🎯 React 學習實戰</h2>
            <p>這個應用展示了 React 的核心概念：</p>
            <ul className="feature-list">
              <li><strong>useState</strong> - 狀態管理</li>
              <li><strong>useEffect</strong> - 副作用處理</li>
              <li><strong>組件化</strong> - 程式碼重用</li>
              <li><strong>事件處理</strong> - 用戶互動</li>
              <li><strong>條件渲染</strong> - 動態顯示</li>
            </ul>
            <p>點擊上方標籤，體驗不同功能！</p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <Header />
      
      <nav className="navigation">
        <button
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 首頁
        </button>
        <button
          className={`nav-btn ${activeTab === 'counter' ? 'active' : ''}`}
          onClick={() => setActiveTab('counter')}
        >
          🔢 計數器
        </button>
        <button
          className={`nav-btn ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          📝 待辦清單
        </button>
        <button
          className={`nav-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          📊 技能進度
        </button>
        <button
          className={`nav-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          🌤️ 天氣
        </button>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="footer">
        <p>🚀 一日速成計劃 - React 實戰練習 | 持續學習中...</p>
      </footer>
    </div>
  );
}

export default App;