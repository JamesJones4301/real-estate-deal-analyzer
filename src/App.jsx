import React, { useState, useEffect } from 'react';
import { TrendingUp, Home, Calculator, DollarSign, Wrench } from 'lucide-react';

const App = () => {
  const [propertyData, setPropertyData] = useState({
    address: '',
    squareFootage: '',
    estimatedARV: '',
    targetPercent: 70
  });

  const [selectedRepairs, setSelectedRepairs] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const repairOptions = [
    { id: 'roof-repair', name: 'Roof Repair', description: 'Minor roof repairs', min: 1000, max: 3000 },
    { id: 'roof-replacement', name: 'Roof Replacement', description: 'Full roof replacement', min: 6000, max: 10000 },
    { id: 'electrical-box', name: 'Electrical Box Replace', description: 'Replace electrical panel', min: 5000, max: 8000 },
    { id: 'gfci', name: 'GFCI Installation', description: 'Add GFCI outlets where needed', min: 1000, max: 3000 },
    { id: 'main-drain', name: 'Main Drain Line', description: 'Replace main drain line', min: 8000, max: 15000 },
    { id: 'exterior-paint', name: 'Exterior Paint', description: 'Paint exterior ($3-4/sqft)', min: 6000, max: 8000 },
    { id: 'siding-wood', name: 'Siding/Wood Rot', description: 'Replace siding or fix wood rot', min: 1000, max: 10000 },
    { id: 'foundation', name: 'Foundation Repair', description: 'Foundation structural repairs', min: 10000, max: 30000 },
    { id: 'windows', name: 'Replace Windows', description: 'Replace all windows', min: 8000, max: 20000 },
    { id: 'driveway', name: 'Driveway', description: 'Driveway repair or replacement', min: 1000, max: 9000 }
  ];

  const toggleRepair = (repairId) => {
    setSelectedRepairs(prev => 
      prev.includes(repairId) 
        ? prev.filter(id => id !== repairId)
        : [...prev, repairId]
    );
  };

  const calculateAnalysis = () => {
    const arv = parseFloat(propertyData.estimatedARV) || 0;
    const targetPercent = parseFloat(propertyData.targetPercent) || 70;
    const sqft = parseFloat(propertyData.squareFootage) || 0;

    // Calculate repair costs (average of min and max)
    const totalRepairCosts = selectedRepairs.reduce((total, repairId) => {
      const repair = repairOptions.find(r => r.id === repairId);
      return total + (repair ? (repair.min + repair.max) / 2 : 0);
    }, 0);

    // Standard real estate investment costs
    const closingCosts = arv * 0.03; // 3% of ARV for closing costs
    const hardMoneyInterest = arv * 0.06; // 6% of ARV for 6 months hard money

    // Main calculation: Max Allowable Offer
    const maxAllowableOffer = (arv * (targetPercent / 100)) - totalRepairCosts - closingCosts - hardMoneyInterest;
    const totalInvestment = maxAllowableOffer + totalRepairCosts + closingCosts + hardMoneyInterest;
    const projectedProfit = arv - totalInvestment;
    const profitMargin = arv > 0 ? (projectedProfit / arv) * 100 : 0;

    // Determine deal quality based on profit margin
    let dealQuality = 'POOR DEAL';
    if (profitMargin >= 20) {
      dealQuality = 'EXCELLENT DEAL';
    } else if (profitMargin >= 15) {
      dealQuality = 'GOOD DEAL';
    } else if (profitMargin >= 10) {
      dealQuality = 'FAIR DEAL';
    }

    setAnalysis({
      maxAllowableOffer: Math.max(0, maxAllowableOffer),
      projectedProfit,
      profitMargin,
      totalInvestment,
      totalRepairCosts,
      closingCosts,
      hardMoneyInterest,
      dealQuality,
      arv,
      targetPercent,
      sqft
    });
  };

  // Recalculate whenever property data or repairs change
  useEffect(() => {
    if (propertyData.estimatedARV && propertyData.squareFootage) {
      calculateAnalysis();
    }
  }, [propertyData, selectedRepairs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analyze Your Next Deal</h1>
          <p className="text-gray-600 text-lg">Get instant repair cost estimates and deal analysis for your investment properties</p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN - Input Forms */}
          <div className="space-y-6">
            
            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Home className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              </div>

              <div className="space-y-4">
                {/* Address Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, City, State"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={propertyData.address}
                    onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                  />
                </div>

                {/* Square Footage and ARV - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
                    <input
                      type="number"
                      placeholder="2000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={propertyData.squareFootage}
                      onChange={(e) => setPropertyData({...propertyData, squareFootage: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated ARV ($)</label>
                    <input
                      type="number"
                      placeholder="400000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={propertyData.estimatedARV}
                      onChange={(e) => setPropertyData({...propertyData, estimatedARV: e.target.value})}
                    />
                  </div>
                </div>

                {/* Target Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target % of ARV</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={propertyData.targetPercent}
                    onChange={(e) => setPropertyData({...propertyData, targetPercent: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Repair Estimator Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Wrench className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Repair Estimator</h2>
                </div>
                {/* Total Repair Cost Badge */}
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${selectedRepairs.reduce((total, repairId) => {
                    const repair = repairOptions.find(r => r.id === repairId);
                    return total + (repair ? (repair.min + repair.max) / 2 : 0);
                  }, 0).toLocaleString()}
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                {selectedRepairs.length} selected
              </div>

              {/* Repair Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {repairOptions.map((repair) => (
                  <div
                    key={repair.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedRepairs.includes(repair.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleRepair(repair.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRepairs.includes(repair.id)}
                            onChange={() => {}}
                            className="mr-3 text-blue-600"
                          />
                          <h3 className="font-semibold text-gray-900">{repair.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{repair.description}</p>
                        <p className="text-sm font-medium text-blue-600 mt-2">
                          ${repair.min.toLocaleString()} - ${repair.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Analysis Results */}
          <div className="space-y-6">
            {analysis && (
              <>
                {/* Deal Analysis Results Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Calculator className="w-6 h-6 text-blue-600 mr-2" />
                      <h2 className="text-2xl font-bold text-gray-900">Deal Analysis</h2>
                    </div>
                    {/* Deal Quality Badge */}
                    <div className={`px-4 py-2 rounded-full font-bold ${
                      analysis.dealQuality === 'EXCELLENT DEAL' ? 'bg-green-100 text-green-800' :
                      analysis.dealQuality === 'GOOD DEAL' ? 'bg-blue-100 text-blue-800' :
                      analysis.dealQuality === 'FAIR DEAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.dealQuality}
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Max Allowable Offer</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${Math.max(0, analysis.maxAllowableOffer).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Projected Profit</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${analysis.projectedProfit.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {analysis.profitMargin.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${analysis.totalInvestment.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Estimated ARV</span>
                      <span className="font-semibold">${analysis.arv.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Target % of ARV</span>
                      <span className="font-semibold">{analysis.targetPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Property Square Footage</span>
                      <span className="font-semibold">{analysis.sqft.toLocaleString()} sqft</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Repair Costs</span>
                      <span className="font-semibold text-red-600">${analysis.totalRepairCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">Closing Costs (3%)</span>
                      <span className="font-semibold text-red-600">${analysis.closingCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Hard Money Interest (6mo)</span>
                      <span className="font-semibold text-red-600">${analysis.hardMoneyInterest.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Make Offer
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Save Analysis
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Show this when no analysis is available */}
            {!analysis && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Property Details</h3>
                <p className="text-gray-600">Fill out the property information to see your deal analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;