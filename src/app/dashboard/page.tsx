'use client';

import { useState, useEffect } from 'react';
import { 
  Camera, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

// Type definitions
interface ShelfMetrics {
  shelfId: string;
  productCount: number;
  condition: string;
  conditionScore: number;
  alerts: number;
  lastUpdated: string;
}

interface TimeSeriesData {
  timestamp: string;
  productCount: number;
  conditionScore: number;
  alerts: number;
}

interface StoreAnalytics {
  totalProducts: number;
  totalValue: number;
  efficiency: number;
  activeAlerts: number;
  avgConfidence: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<StoreAnalytics | null>(null);
  const [shelves, setShelves] = useState<ShelfMetrics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock analytics
      const mockAnalytics: StoreAnalytics = {
        totalProducts: Math.floor(Math.random() * 200) + 150,
        totalValue: Math.floor(Math.random() * 5000) + 8000,
        efficiency: Math.floor(Math.random() * 15) + 85,
        activeAlerts: Math.floor(Math.random() * 10) + 3,
        avgConfidence: 0.95 + Math.random() * 0.04,
      };
      
      // Generate mock shelf data
      const mockShelves: ShelfMetrics[] = Array.from({ length: 12 }, (_, i) => ({
        shelfId: `Shelf ${i + 1}`,
        productCount: Math.floor(Math.random() * 20) + 10,
        condition: ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)],
        conditionScore: Math.floor(Math.random() * 40) + 60,
        alerts: Math.floor(Math.random() * 3),
        lastUpdated: `${Math.floor(Math.random() * 5) + 1}m ago`,
      }));
      
      // Generate time series data
      const now = Date.now();
      const mockTimeSeries: TimeSeriesData[] = Array.from({ length: 48 }, (_, i) => ({
        timestamp: new Date(now - (47 - i) * 30 * 60 * 1000).toISOString(),
        productCount: Math.floor(Math.random() * 30) + 140,
        conditionScore: Math.floor(Math.random() * 20) + 75,
        alerts: Math.floor(Math.random() * 8) + 2,
      }));
      
      setAnalytics(mockAnalytics);
      setShelves(mockShelves);
      setTimeSeriesData(mockTimeSeries);
      setLoading(false);
    };
    
    fetchData();
    
    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedTimeRange]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-300';
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Fair': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Poor': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-teal animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                <span className="gradient-text">ShelfSense</span> Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Real-time shelf intelligence monitoring</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-primary-teal transition-all"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  autoRefresh 
                    ? 'bg-primary-teal text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Export Button */}
              <button className="px-4 py-2 bg-gradient-to-r from-primary-mint to-primary-teal text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-primary-teal rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{analytics?.totalProducts}</p>
            <p className="text-sm text-gray-600 font-semibold">Total Products</p>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-primary-gold rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">${analytics?.totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600 font-semibold">Inventory Value</p>
          </div>

          {/* Efficiency */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-primary-mint rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +5%
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{analytics?.efficiency}%</p>
            <p className="text-sm text-gray-600 font-semibold">Efficiency Score</p>
          </div>

          {/* Active Alerts */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                -{15}%
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{analytics?.activeAlerts}</p>
            <p className="text-sm text-gray-600 font-semibold">Active Alerts</p>
          </div>

          {/* Detection Accuracy */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                +2%
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{(analytics?.avgConfidence! * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600 font-semibold">Detection Accuracy</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Count Trend */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Product Count Trend</h3>
              <TrendingUp className="w-6 h-6 text-primary-teal" />
            </div>
            
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 62.5}
                    x2="800"
                    y2={i * 62.5}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#7ADAA5', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#7ADAA5', stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>
                
                <path
                  d={`M 0 ${250 - (timeSeriesData[0]?.productCount || 0) * 1.2} ${timeSeriesData
                    .map((d, i) => `L ${(i / (timeSeriesData.length - 1)) * 800} ${250 - d.productCount * 1.2}`)
                    .join(' ')} L 800 250 L 0 250 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Line */}
                <path
                  d={`M 0 ${250 - (timeSeriesData[0]?.productCount || 0) * 1.2} ${timeSeriesData
                    .map((d, i) => `L ${(i / (timeSeriesData.length - 1)) * 800} ${250 - d.productCount * 1.2}`)
                    .join(' ')}`}
                  stroke="#239BA7"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Condition Score */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Condition Score</h3>
              <Activity className="w-6 h-6 text-primary-mint" />
            </div>
            
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 62.5}
                    x2="800"
                    y2={i * 62.5}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Line */}
                <path
                  d={`M 0 ${250 - (timeSeriesData[0]?.conditionScore || 0) * 2.5} ${timeSeriesData
                    .map((d, i) => `L ${(i / (timeSeriesData.length - 1)) * 800} ${250 - d.conditionScore * 2.5}`)
                    .join(' ')}`}
                  stroke="#E1AA36"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Dots */}
                {timeSeriesData.map((d, i) => (
                  i % 6 === 0 && (
                    <circle
                      key={i}
                      cx={(i / (timeSeriesData.length - 1)) * 800}
                      cy={250 - d.conditionScore * 2.5}
                      r="5"
                      fill="#E1AA36"
                    />
                  )
                ))}
              </svg>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Shelf Grid */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-gray-900">Shelf Monitoring</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select className="px-3 py-2 border-2 border-gray-200 rounded-lg font-semibold text-sm">
                <option>All Shelves</option>
                <option>Needs Attention</option>
                <option>Excellent</option>
                <option>Good</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shelves.map((shelf) => (
              <div
                key={shelf.shelfId}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-black text-gray-900">{shelf.shelfId}</h4>
                  {shelf.alerts > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Products</span>
                    <span className="text-sm font-bold text-gray-900">{shelf.productCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-sm font-bold text-gray-900">{shelf.conditionScore}/100</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 text-center ${getConditionColor(shelf.condition)}`}>
                    {shelf.condition}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {shelf.lastUpdated}
                    </span>
                    {shelf.alerts > 0 && (
                      <span className="text-xs font-bold text-red-600">
                        {shelf.alerts} alerts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Alerts</h3>
          
          <div className="space-y-3">
            {[
              { type: 'Low Stock', shelf: 'Shelf 3', product: 'Coca Cola 2L', time: '2m ago', severity: 'high' },
              { type: 'Misplaced', shelf: 'Shelf 7', product: 'Doritos Nacho', time: '5m ago', severity: 'medium' },
              { type: 'Low Stock', shelf: 'Shelf 1', product: 'Red Bull Energy', time: '8m ago', severity: 'high' },
              { type: 'Misplaced', shelf: 'Shelf 11', product: 'Cheerios', time: '12m ago', severity: 'low' },
            ].map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    alert.severity === 'high' ? 'bg-red-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div>
                    <p className="font-bold text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.shelf} • {alert.product}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{alert.time}</span>
                  <button className="px-4 py-2 bg-primary-teal text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
