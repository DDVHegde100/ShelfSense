'use client';

import { useState, useEffect } from 'react';
import { Camera, Zap, RefreshCw, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';

interface Detection {
  product_name: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  is_misplaced: boolean;
  is_low_stock: boolean;
}

interface SimulationResult {
  snapshot_id: string;
  shelf_id: string;
  timestamp: string;
  detections: Detection[];
  metrics: {
    total_products: number;
    avg_confidence: number;
    total_value: number;
    misplaced_count: number;
    low_stock_count: number;
  };
  condition: {
    overall_score: number;
    condition: string;
    alerts: number;
  };
  processing_time_ms: number;
}

export default function SecretSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentFrame(0);
    addLog('🚀 Starting ML simulation...');
    
    // Simulate frame processing
    for (let i = 1; i <= 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setCurrentFrame(i);
      
      if (i === 5) addLog('📸 Image captured from camera');
      if (i === 10) addLog('🔧 Preprocessing with OpenCV...');
      if (i === 15) addLog('🤖 Running YOLOv8 detection...');
      if (i === 20) addLog('🎨 CLIP classification in progress...');
      if (i === 25) addLog('📊 Aggregating metrics...');
    }
    
    // Fetch simulation data
    addLog('🌐 Fetching detection results...');
    try {
      const response = await fetch('/api/simulation?type=shelf&shelfId=shelf_demo&storeId=store_demo');
      const data = await response.json();
      setResults(data);
      addLog(`✅ Detected ${data.metrics.total_products} products with ${(data.metrics.avg_confidence * 100).toFixed(1)}% confidence`);
      addLog(`📈 Condition: ${data.condition.condition} (${data.condition.overall_score}/100)`);
      if (data.condition.alerts > 0) {
        addLog(`⚠️  ${data.condition.alerts} alerts detected`);
      }
    } catch (error) {
      addLog('❌ Simulation error');
    }
    
    setIsRunning(false);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setCurrentFrame(0);
    addLog('⏹️  Simulation stopped');
  };

  const resetSimulation = () => {
    setResults(null);
    setLogs([]);
    setCurrentFrame(0);
    setSelectedDetection(null);
    addLog('🔄 Simulation reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-mint to-primary-teal rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">
                  <span className="bg-gradient-to-r from-primary-mint to-primary-teal bg-clip-text text-transparent">
                    ShelfSense
                  </span>
                  {' '}Secret Lab
                </h1>
                <p className="text-xs text-gray-400">ML Simulation Sandbox</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isRunning ? (
                <button
                  onClick={runSimulation}
                  className="px-6 py-3 bg-gradient-to-r from-primary-mint to-primary-teal text-white rounded-xl font-bold hover:shadow-xl hover:shadow-teal-500/50 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Run Simulation
                </button>
              ) : (
                <button
                  onClick={stopSimulation}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-red-500/50 transition-all flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Stop
                </button>
              )}
              
              <button
                onClick={resetSimulation}
                className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-400">Processing Pipeline</span>
            <span className="text-sm font-bold text-primary-mint">{currentFrame}/30 frames</span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-mint to-primary-teal transition-all duration-300 ease-out"
              style={{ width: `${(currentFrame / 30) * 100}%` }}
            />
          </div>
          {isRunning && (
            <div className="mt-3 flex items-center gap-2 text-primary-mint text-sm">
              <div className="w-2 h-2 bg-primary-mint rounded-full animate-pulse" />
              <span className="font-semibold">Running ML inference...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Visualization */}
          <div className="space-y-6">
            {/* Simulated Camera Feed */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">Camera Feed</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">LIVE</span>
                </div>
              </div>
              
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {/* Simulated shelf image with detections */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {results ? (
                    <div className="relative w-full h-full">
                      {/* Simulated shelf background */}
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800" />
                      
                      {/* Detection boxes */}
                      {results.detections.slice(0, 8).map((detection, idx) => {
                        const scale = 0.5; // Scale down for display
                        const x = (detection.bbox.x * scale) / 1920 * 100;
                        const y = (detection.bbox.y * scale) / 1080 * 100;
                        const w = (detection.bbox.width * scale) / 1920 * 100;
                        const h = (detection.bbox.height * scale) / 1080 * 100;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDetection(detection)}
                            className="absolute border-2 rounded-lg transition-all hover:scale-105"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: `${w}%`,
                              height: `${h}%`,
                              borderColor: detection.is_misplaced 
                                ? '#EF4444' 
                                : detection.is_low_stock 
                                ? '#F59E0B' 
                                : '#7ADAA5',
                              backgroundColor: detection.is_misplaced 
                                ? 'rgba(239, 68, 68, 0.1)' 
                                : detection.is_low_stock 
                                ? 'rgba(245, 158, 11, 0.1)' 
                                : 'rgba(122, 218, 165, 0.1)',
                            }}
                          >
                            <div className="absolute -top-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {(detection.confidence * 100).toFixed(0)}%
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold">Waiting for simulation...</p>
                    </div>
                  )}
                </div>
                
                {/* FPS Counter */}
                <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-lg text-xs font-bold text-green-400">
                  30 FPS
                </div>
              </div>
            </div>

            {/* Detection Details */}
            {selectedDetection && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-black mb-4">Selected Detection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Product</span>
                    <span className="font-bold">{selectedDetection.product_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-bold text-primary-mint">
                      {(selectedDetection.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      {selectedDetection.is_misplaced && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">
                          Misplaced
                        </span>
                      )}
                      {selectedDetection.is_low_stock && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">
                          Low Stock
                        </span>
                      )}
                      {!selectedDetection.is_misplaced && !selectedDetection.is_low_stock && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                          Normal
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Bounding Box</span>
                    <span className="font-mono text-xs text-gray-500">
                      [{selectedDetection.bbox.x}, {selectedDetection.bbox.y}, {selectedDetection.bbox.width}, {selectedDetection.bbox.height}]
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Metrics & Logs */}
          <div className="space-y-6">
            {/* Metrics */}
            {results && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-black mb-6">Metrics</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-black text-primary-mint mb-1">
                      {results.metrics.total_products}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">Products Detected</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-black text-primary-teal mb-1">
                      {(results.metrics.avg_confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">Avg Confidence</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-black text-primary-gold mb-1">
                      ${results.metrics.total_value.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">Total Value</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="text-3xl font-black text-red-400 mb-1">
                      {results.condition.alerts}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">Alerts</div>
                  </div>
                </div>

                {/* Condition Score */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-400">Shelf Condition</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      results.condition.condition === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                      results.condition.condition === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                      results.condition.condition === 'Fair' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {results.condition.condition}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          results.condition.overall_score >= 85 ? 'bg-green-500' :
                          results.condition.overall_score >= 70 ? 'bg-blue-500' :
                          results.condition.overall_score >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${results.condition.overall_score}%` }}
                      />
                    </div>
                    <span className="text-lg font-black">{results.condition.overall_score}/100</span>
                  </div>
                </div>

                {/* Processing Time */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Processing Time</span>
                    <span className="font-bold text-primary-mint">{results.processing_time_ms}ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Console Logs */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-black mb-4">Console</h2>
              <div className="bg-black rounded-xl p-4 h-96 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <div className="text-gray-600">Waiting for simulation...</div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="text-green-400">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
