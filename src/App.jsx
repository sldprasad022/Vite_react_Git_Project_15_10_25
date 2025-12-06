import React, { useState, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChevronRight, Package, Filter, ShoppingCart, Check, X, AlertCircle, Plus, Zap } from 'lucide-react';
import Home from './components/home';
import About from './components/about';
import Profile from './components/profile';
import Contact from './components/contact';
import Services from './components/services';
import Portfolio from './components/portfolio';

// Move static data outside component to avoid recreation on each render
const DOMAINS = {
    fashion: {
      name: 'Fashion Store',
      color: 'pink',
      units: [
        { id: 'u1', name: 'Centimeters', symbol: 'cm', type: 'length' },
        { id: 'u2', name: 'Kilograms', symbol: 'kg', type: 'weight' },
        { id: 'u3', name: 'Pieces', symbol: 'pcs', type: 'count' }
      ],
      categories: [
        { id: 'c1', name: 'Clothing', parent: null, level: 0 },
        { id: 'c2', name: 'Men', parent: 'c1', level: 1 },
        { id: 'c3', name: 'T-Shirts', parent: 'c2', level: 2 }
      ],
      attributes: [
        { id: 'a1', name: 'Color', type: 'select', options: ['Red', 'Blue', 'Green', 'Black'], filterable: true },
        { id: 'a2', name: 'Size', type: 'select', options: ['S', 'M', 'L', 'XL'], filterable: true },
        { id: 'a3', name: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Blend'], filterable: true }
      ],
      brands: [
        { id: 'b1', name: 'Nike' },
        { id: 'b2', name: 'Adidas' }
      ],
      products: [
        {
          id: 'p1',
          name: 'Classic Cotton T-Shirt',
          category: 'T-Shirts',
          brand: 'Nike',
          basePrice: 29.99,
          specs: [
            { attr: 'Material', value: 'Cotton' }
          ],
          variants: [
            { id: 'v1', attrs: { Color: 'Red', Size: 'M' }, stock: 50, sku: 'NIKE-TEE-RED-M' },
            { id: 'v2', attrs: { Color: 'Blue', Size: 'L' }, stock: 30, sku: 'NIKE-TEE-BLUE-L' }
          ]
        }
      ]
    },
    electronics: {
      name: 'Tech Hub',
      color: 'blue',
      units: [
        { id: 'u1', name: 'Inches', symbol: 'in', type: 'length' },
        { id: 'u2', name: 'Watts', symbol: 'W', type: 'power' },
        { id: 'u3', name: 'Gigahertz', symbol: 'GHz', type: 'frequency' }
      ],
      categories: [
        { id: 'c1', name: 'Electronics', parent: null, level: 0 },
        { id: 'c2', name: 'Computers', parent: 'c1', level: 1 },
        { id: 'c3', name: 'Laptops', parent: 'c2', level: 2 }
      ],
      attributes: [
        { id: 'a1', name: 'RAM', type: 'select', options: ['8GB', '16GB', '32GB'], filterable: true },
        { id: 'a2', name: 'Storage', type: 'select', options: ['256GB', '512GB', '1TB'], filterable: true },
        { id: 'a3', name: 'Screen Size', type: 'number', unit: 'in', filterable: true },
        { id: 'a4', name: 'Processor', type: 'text', filterable: false }
      ],
      brands: [
        { id: 'b1', name: 'Dell' },
        { id: 'b2', name: 'HP' }
      ],
      products: [
        {
          id: 'p1',
          name: 'Dell Inspiron 15',
          category: 'Laptops',
          brand: 'Dell',
          basePrice: 799.99,
          specs: [
            { attr: 'Processor', value: 'Intel Core i7' },
            { attr: 'Screen Size', value: '15.6', unit: 'in' }
          ],
          variants: [
            { id: 'v1', attrs: { RAM: '16GB', Storage: '512GB' }, stock: 15, sku: 'DELL-I15-16-512' },
            { id: 'v2', attrs: { RAM: '32GB', Storage: '1TB' }, stock: 8, sku: 'DELL-I15-32-1TB' }
          ]
        }
      ]
    },
    grocery: {
      name: 'Fresh Mart',
      color: 'green',
      units: [
        { id: 'u1', name: 'Kilograms', symbol: 'kg', type: 'weight' },
        { id: 'u2', name: 'Liters', symbol: 'L', type: 'volume' },
        { id: 'u3', name: 'Pieces', symbol: 'pcs', type: 'count' }
      ],
      categories: [
        { id: 'c1', name: 'Food', parent: null, level: 0 },
        { id: 'c2', name: 'Dairy', parent: 'c1', level: 1 },
        { id: 'c3', name: 'Milk', parent: 'c2', level: 2 }
      ],
      attributes: [
        { id: 'a1', name: 'Volume', type: 'number', unit: 'L', filterable: true },
        { id: 'a2', name: 'Fat Content', type: 'select', options: ['Full Cream', 'Toned', 'Skimmed'], filterable: true },
        { id: 'a3', name: 'Organic', type: 'boolean', filterable: true },
        { id: 'a4', name: 'Expiry Date', type: 'date', filterable: false }
      ],
      brands: [
        { id: 'b1', name: 'Amul' },
        { id: 'b2', name: 'Mother Dairy' }
      ],
      products: [
        {
          id: 'p1',
          name: 'Fresh Milk',
          category: 'Milk',
          brand: 'Amul',
          basePrice: 3.49,
          specs: [
            { attr: 'Organic', value: true },
            { attr: 'Expiry Date', value: '2025-11-20' }
          ],
          variants: [
            { id: 'v1', attrs: { Volume: '1', 'Fat Content': 'Full Cream' }, stock: 200, sku: 'AMUL-MILK-1L-FC' },
            { id: 'v2', attrs: { Volume: '0.5', 'Fat Content': 'Toned' }, stock: 150, sku: 'AMUL-MILK-500ML-T' }
          ]
        }
      ]
    }
  };

const MultiDomainSimulation = () => {
  return (
    <Routes>
      <Route path="/" element={<MultiDomainSimulationContent />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  );
};

const MultiDomainSimulationContent = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedDomain, setSelectedDomain] = useState('fashion');
  const [adminStep, setAdminStep] = useState(0);
  const [vendorStep, setVendorStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Memoize current domain to avoid recalculation
  const currentDomain = useMemo(() => DOMAINS[selectedDomain], [selectedDomain]);
  const currentProduct = useMemo(() => currentDomain.products[0], [currentDomain]);

  // Optimize cart operations with useCallback
  const addToCart = useCallback((product, variant) => {
    setCart(prevCart => [...prevCart, { product, variant, quantity: 1 }]);
  }, []);

  const placeOrder = useCallback(() => {
    setOrderPlaced(true);
    // Simulate inventory deduction
    cart.forEach(item => {
      const variant = currentProduct.variants.find(v => v.id === item.variant.id);
      if (variant) variant.stock -= item.quantity;
    });
  }, [cart, currentProduct.variants]);

  const resetSimulation = useCallback(() => {
    setAdminStep(0);
    setVendorStep(0);
    setCart([]);
    setOrderPlaced(false);
    setSelectedProduct(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Cross-Domain E-commerce Simulation
              </h1>
              <p className="text-slate-600">
                Experience how the same system handles Fashion, Electronics, and Groceries
              </p>
            </div>
            <Zap className="w-12 h-12 text-amber-500" />
          </div>
        </div>

        {/* Domain Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Select Domain</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(DOMAINS).map(([key, domain]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedDomain(key);
                  resetSimulation();
                }}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedDomain === key
                    ? `border-${domain.color}-500 bg-${domain.color}-50`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Package className={`w-8 h-8 mb-2 text-${domain.color}-600`} />
                <h3 className="font-bold text-lg">{domain.name}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {key === 'fashion' && 'Clothing & Accessories'}
                  {key === 'electronics' && 'Tech & Gadgets'}
                  {key === 'grocery' && 'Food & Beverages'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            {['setup', 'vendor', 'customer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab === 'setup' && '1. Admin Setup'}
                {tab === 'vendor' && '2. Vendor Creates Product'}
                {tab === 'customer' && '3. Customer Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'setup' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Admin Configuration - {currentDomain.name}
              </h2>
              
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {['Units', 'Categories', 'Attributes', 'Brands'].map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx <= adminStep ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx < adminStep ? <Check className="w-6 h-6" /> : idx + 1}
                      </div>
                      {idx < 3 && (
                        <ChevronRight className={`w-6 h-6 mx-2 ${
                          idx < adminStep ? 'text-green-500' : 'text-slate-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              {adminStep === 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Step 1: Create Measurement Units</h3>
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Symbol</th>
                          <th className="text-left py-2">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDomain.units.map(unit => (
                          <tr key={unit.id} className="border-b">
                            <td className="py-2">{unit.name}</td>
                            <td className="py-2 font-mono">{unit.symbol}</td>
                            <td className="py-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {unit.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() => setAdminStep(1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next: Create Categories
                  </button>
                </div>
              )}

              {adminStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Step 2: Define Category Hierarchy</h3>
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    {currentDomain.categories.map(cat => (
                      <div
                        key={cat.id}
                        className="py-2 flex items-center"
                        style={{ paddingLeft: `${cat.level * 24}px` }}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="font-medium">{cat.name}</span>
                        <span className="ml-2 text-sm text-slate-500">(Level {cat.level})</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminStep(0)}
                      className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setAdminStep(2)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next: Create Attributes
                    </button>
                  </div>
                </div>
              )}

              {adminStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Step 3: Create Dynamic Attributes</h3>
                  <div className="space-y-4 mb-4">
                    {currentDomain.attributes.map(attr => (
                      <div key={attr.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">{attr.name}</h4>
                          {attr.filterable && (
                            <span className="flex items-center text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              <Filter className="w-4 h-4 mr-1" />
                              Filterable
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Type:</span> {attr.type}
                          {attr.unit && <span> ({attr.unit})</span>}
                        </div>
                        {attr.options && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {attr.options.map((opt, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white border rounded text-sm">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminStep(1)}
                      className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setAdminStep(3)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next: Add Brands
                    </button>
                  </div>
                </div>
              )}

              {adminStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Step 4: Register Brands</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {currentDomain.brands.map(brand => (
                      <div key={brand.id} className="bg-slate-50 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-slate-200">
                          <span className="text-2xl font-bold text-slate-600">
                            {brand.name[0]}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg">{brand.name}</h4>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-green-700">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Admin setup complete for {currentDomain.name}!</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminStep(2)}
                      className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveTab('vendor')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Continue to Vendor Phase →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vendor' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Vendor Product Creation - {currentDomain.name}
              </h2>

              {vendorStep === 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Create Product: {currentProduct.name}</h3>
                  <div className="bg-slate-50 rounded-lg p-6 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                          type="text"
                          value={currentProduct.name}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <input
                          type="text"
                          value={currentProduct.category}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Brand</label>
                        <input
                          type="text"
                          value={currentProduct.brand}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Base Price</label>
                        <input
                          type="text"
                          value={`$${currentProduct.basePrice}`}
                          disabled
                          className="w-full px-4 py-2 border rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    
                    <h4 className="font-bold mb-2">Product Specifications (Attribute-Driven)</h4>
                    {currentProduct.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-4 mb-2">
                        <span className="font-medium w-32">{spec.attr}:</span>
                        <span className="px-3 py-1 bg-white border rounded">
                          {typeof spec.value === 'boolean' ? (spec.value ? 'Yes' : 'No') : spec.value}
                          {spec.unit && ` ${spec.unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setVendorStep(1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next: Add Variants
                  </button>
                </div>
              )}

              {vendorStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Add Product Variants</h3>
                  <div className="space-y-4 mb-4">
                    {currentProduct.variants.map(variant => (
                      <div key={variant.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold">Variant: {variant.sku}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            variant.stock > 20 ? 'bg-green-100 text-green-700' :
                            variant.stock > 5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            Stock: {variant.stock}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(variant.attrs).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm text-slate-600">{key}:</span>
                              <div className="font-medium">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-green-700">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Product created successfully with {currentProduct.variants.length} variants!</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVendorStep(0)}
                      className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveTab('customer')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Continue to Customer Phase →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customer' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Customer Shopping Experience - {currentDomain.name}
              </h2>

              {!orderPlaced ? (
                <>
                  {/* Product Display */}
                  <div className="bg-slate-50 rounded-lg p-6 mb-6">
                    <div className="flex gap-6">
                      <div className="w-48 h-48 bg-white rounded-lg border-2 border-slate-200 flex items-center justify-center">
                        <Package className="w-24 h-24 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{currentProduct.name}</h3>
                        <p className="text-slate-600 mb-4">{currentProduct.brand} • {currentProduct.category}</p>
                        <p className="text-3xl font-bold text-blue-600 mb-4">${currentProduct.basePrice}</p>
                        
                        <h4 className="font-bold mb-2">Specifications:</h4>
                        <div className="space-y-1 mb-4">
                          {currentProduct.specs.map((spec, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{spec.attr}:</span>{' '}
                              {typeof spec.value === 'boolean' ? (spec.value ? 'Yes' : 'No') : spec.value}
                              {spec.unit && ` ${spec.unit}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variant Selection */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3">Select Variant:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {currentProduct.variants.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedProduct(variant)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedProduct?.id === variant.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-medium mb-2">
                            {Object.entries(variant.attrs).map(([, v]) => v).join(' • ')}
                          </div>
                          <div className="text-sm text-slate-600">SKU: {variant.sku}</div>
                          <div className={`text-sm font-medium mt-2 ${
                            variant.stock > 20 ? 'text-green-600' :
                            variant.stock > 5 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {variant.stock} in stock
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  {selectedProduct && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(currentProduct, selectedProduct)}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  )}

                  {/* Cart */}
                  {cart.length > 0 && (
                    <div className="mt-6 bg-white border-2 border-slate-200 rounded-lg p-6">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Cart ({cart.length})
                      </h4>
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b">
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-slate-600">
                              {Object.entries(item.variant.attrs).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                            </div>
                          </div>
                          <div className="font-bold">${item.product.basePrice}</div>
                        </div>
                      ))}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ${(cart.reduce((sum, item) => sum + item.product.basePrice, 0)).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={placeOrder}
                          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Order Placed Successfully!</h3>
                  
                  <div className="bg-slate-50 rounded-lg p-6 max-w-2xl mx-auto mb-6">
                    <h4 className="font-bold mb-4">Order Summary</h4>
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b">
                        <div className="text-left">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-slate-600">
                            {Object.entries(item.variant.attrs).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                          </div>
                        </div>
                        <div className="font-bold">${item.product.basePrice}</div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        ${(cart.reduce((sum, item) => sum + item.product.basePrice, 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2 justify-center">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Inventory Updated
                    </h4>
                    <div className="space-y-2">
                      {cart.map((item, idx) => {
                        const variant = currentProduct.variants.find(v => v.id === item.variant.id);
                        return (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{variant.sku}:</span> 
                            <span className="text-slate-600"> Stock reduced from {variant.stock + 1} to </span>
                            <span className="font-bold text-blue-600">{variant.stock}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setOrderPlaced(false);
                        setCart([]);
                        setSelectedProduct(null);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Place Another Order
                    </button>
                    <button
                      onClick={() => {
                        resetSimulation();
                        setActiveTab('setup');
                      }}
                      className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Flow Diagram */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Complete Flow Visualization</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${activeTab === 'setup' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <div className="font-bold mb-2">1. Admin Setup</div>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>✓ Create measurement units</li>
                <li>✓ Define category hierarchy</li>
                <li>✓ Create dynamic attributes</li>
                <li>✓ Mark filterable attributes</li>
                <li>✓ Register brands</li>
              </ul>
            </div>
            <div className={`p-4 rounded-lg border-2 ${activeTab === 'vendor' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <div className="font-bold mb-2">2. Vendor Actions</div>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>✓ Create product</li>
                <li>✓ Select category & brand</li>
                <li>✓ Fill specifications (attributes)</li>
                <li>✓ Add variants</li>
                <li>✓ Set variant inventory</li>
              </ul>
            </div>
            <div className={`p-4 rounded-lg border-2 ${activeTab === 'customer' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <div className="font-bold mb-2">3. Customer Journey</div>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>✓ Browse products</li>
                <li>✓ Apply dynamic filters</li>
                <li>✓ Select variant</li>
                <li>✓ Add to cart</li>
                <li>✓ Place order</li>
                <li>✓ Inventory auto-updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-slate-800">🎯 Key Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold mb-2 text-purple-600">Same Schema, Different Data</h4>
              <p className="text-sm text-slate-600">
                Fashion uses "Color & Size", Electronics uses "RAM & Storage", 
                Groceries uses "Volume & Fat Content" - all stored in the same attribute system.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold mb-2 text-blue-600">Dynamic Filtering</h4>
              <p className="text-sm text-slate-600">
                MongoDB aggregation extracts unique attribute values with product counts 
                in real-time - no hardcoded filters needed.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold mb-2 text-green-600">Variant-Level Stock</h4>
              <p className="text-sm text-slate-600">
                Each variant tracks its own inventory. When an order is placed, 
                only the specific variant's stock is reduced.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold mb-2 text-orange-600">Domain Switching</h4>
              <p className="text-sm text-slate-600">
                Switch domains by changing the database. No code changes required 
                for basic functionality - just load different categories & attributes.
              </p>
            </div>
          </div>
        </div>

        {/* Database Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Database Comparison Across Domains</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 px-4">Component</th>
                  <th className="text-left py-3 px-4">Fashion</th>
                  <th className="text-left py-3 px-4">Electronics</th>
                  <th className="text-left py-3 px-4">Grocery</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Units</td>
                  <td className="py-3 px-4">cm, kg, pieces</td>
                  <td className="py-3 px-4">inches, watts, GHz</td>
                  <td className="py-3 px-4">kg, liters, pieces</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Root Category</td>
                  <td className="py-3 px-4">Clothing</td>
                  <td className="py-3 px-4">Electronics</td>
                  <td className="py-3 px-4">Food</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Key Attributes</td>
                  <td className="py-3 px-4">Color, Size, Material</td>
                  <td className="py-3 px-4">RAM, Storage, Screen</td>
                  <td className="py-3 px-4">Volume, Fat %, Organic</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Brands</td>
                  <td className="py-3 px-4">Nike, Adidas</td>
                  <td className="py-3 px-4">Dell, HP</td>
                  <td className="py-3 px-4">Amul, Mother Dairy</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Variant Logic</td>
                  <td className="py-3 px-4">Color × Size</td>
                  <td className="py-3 px-4">RAM × Storage</td>
                  <td className="py-3 px-4">Volume × Fat Content</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiDomainSimulation;