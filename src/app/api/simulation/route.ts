import { NextResponse } from 'next/server';

// Simulated product database
const PRODUCTS = [
  { id: "P001", name: "Coca Cola 2L", category: "Beverages", price: 2.99, brand: "Coca Cola" },
  { id: "P002", name: "Pepsi 2L", category: "Beverages", price: 2.79, brand: "Pepsi" },
  { id: "P003", name: "Sprite 2L", category: "Beverages", price: 2.89, brand: "Coca Cola" },
  { id: "P004", name: "Mountain Dew 2L", category: "Beverages", price: 2.99, brand: "Pepsi" },
  { id: "P005", name: "Lays Classic", category: "Snacks", price: 3.49, brand: "Lays" },
  { id: "P006", name: "Doritos Nacho", category: "Snacks", price: 3.79, brand: "Doritos" },
  { id: "P007", name: "Cheetos Puffs", category: "Snacks", price: 3.29, brand: "Cheetos" },
  { id: "P008", name: "Pringles Original", category: "Snacks", price: 2.99, brand: "Pringles" },
  { id: "P009", name: "Tide Detergent", category: "Household", price: 12.99, brand: "Tide" },
  { id: "P010", name: "Bounty Paper Towels", category: "Household", price: 8.99, brand: "Bounty" },
];

function generateShelfSnapshot(shelfId: string, storeId: string) {
  const numProducts = Math.floor(Math.random() * 15) + 10;
  const detections = [];
  
  for (let i = 0; i < numProducts; i++) {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    detections.push({
      detection_id: `det_${shelfId}_${i}_${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      brand: product.brand,
      confidence: 0.85 + Math.random() * 0.14,
      bbox: {
        x: Math.floor(Math.random() * 1600) + 50,
        y: Math.floor(Math.random() * 800) + 50,
        width: Math.floor(Math.random() * 120) + 80,
        height: Math.floor(Math.random() * 150) + 100,
      },
      is_misplaced: Math.random() < 0.05,
      is_low_stock: Math.random() < 0.15,
      timestamp: new Date().toISOString(),
    });
  }
  
  const totalValue = detections.reduce((sum, d) => {
    const product = PRODUCTS.find(p => p.id === d.product_id);
    return sum + (product?.price || 0);
  }, 0);
  
  const misplacedCount = detections.filter(d => d.is_misplaced).length;
  const lowStockCount = detections.filter(d => d.is_low_stock).length;
  const alerts = misplacedCount + lowStockCount;
  
  const conditionScore = Math.max(0, 100 - (misplacedCount * 10) - (lowStockCount * 5) + (numProducts / 20) * 30);
  
  let condition = 'Excellent';
  if (conditionScore < 85) condition = 'Good';
  if (conditionScore < 70) condition = 'Fair';
  if (conditionScore < 50) condition = 'Poor';
  
  return {
    snapshot_id: `snap_${shelfId}_${Date.now()}`,
    shelf_id: shelfId,
    store_id: storeId,
    timestamp: new Date().toISOString(),
    detections,
    metrics: {
      total_products: detections.length,
      unique_products: new Set(detections.map(d => d.product_id)).size,
      avg_confidence: detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length,
      total_value: totalValue,
      misplaced_count: misplacedCount,
      low_stock_count: lowStockCount,
    },
    condition: {
      overall_score: conditionScore,
      condition,
      alerts,
    },
    processing_time_ms: Math.floor(Math.random() * 170) + 80,
  };
}

function generateStoreAnalytics(storeId: string, numShelves: number = 12) {
  const shelves = [];
  
  for (let i = 0; i < numShelves; i++) {
    const snapshot = generateShelfSnapshot(`shelf_${i + 1}`, storeId);
    shelves.push(snapshot);
  }
  
  const totalProducts = shelves.reduce((sum, s) => sum + s.metrics.total_products, 0);
  const totalValue = shelves.reduce((sum, s) => sum + s.metrics.total_value, 0);
  const avgConfidence = shelves.reduce((sum, s) => sum + s.metrics.avg_confidence, 0) / shelves.length;
  const totalAlerts = shelves.reduce((sum, s) => sum + s.condition.alerts, 0);
  
  const shelvesGood = shelves.filter(s => s.condition.overall_score >= 70).length;
  const efficiency = (shelvesGood / numShelves) * 100;
  
  return {
    store_id: storeId,
    timestamp: new Date().toISOString(),
    summary: {
      total_shelves: numShelves,
      total_products: totalProducts,
      total_value: totalValue,
      avg_confidence: avgConfidence,
      total_alerts: totalAlerts,
      efficiency_score: efficiency,
    },
    shelf_snapshots: shelves,
    performance: {
      excellent_shelves: shelves.filter(s => s.condition.condition === 'Excellent').length,
      good_shelves: shelves.filter(s => s.condition.condition === 'Good').length,
      fair_shelves: shelves.filter(s => s.condition.condition === 'Fair').length,
      poor_shelves: shelves.filter(s => s.condition.condition === 'Poor').length,
    },
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'store';
  const storeId = searchParams.get('storeId') || 'store_001';
  const shelfId = searchParams.get('shelfId');
  
  try {
    if (type === 'shelf' && shelfId) {
      const snapshot = generateShelfSnapshot(shelfId, storeId);
      return NextResponse.json(snapshot);
    }
    
    if (type === 'store') {
      const analytics = generateStoreAnalytics(storeId);
      return NextResponse.json(analytics);
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
