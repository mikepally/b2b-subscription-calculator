'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Download, Send, Users, DollarSign, Package, Plus, X, AlertCircle } from 'lucide-react';

// TypeScript Interfaces
interface TierSeats {
  tier1: number;
  tier2: number;
  tier3: number;
}

interface AddOns {
  teamPortal: boolean;
}

interface Course {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface AdditionalCourses {
  tier1: Course[];
  tier2: Course[];
}

interface CourseCalculation {
  id: string;
  name: string;
  price: string;
  quantity: number;
  totalCost: number;
  discountedCost: number;
}

interface TierCoursesDetail {
  courses: CourseCalculation[];
  original: number;
  discounted: number;
  saved: number;
  discount: string;
}

interface Calculations {
  subtotal: number;
  discount: number;
  discountRate: number;
  addOnsTotal: number;
  additionalCoursesTotal: number;
  additionalCoursesDetails: {
    tier1?: TierCoursesDetail;
    tier2?: TierCoursesDetail;
  };
  finalTotal: number;
  totalSeats: number;
  discountNote: string;
  tierSubtotals?: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

interface TierPricingInfo {
  price: number;
  name: string;
  description: string;
}

interface TierPricing {
  tier1: TierPricingInfo;
  tier2: TierPricingInfo;
  tier3: TierPricingInfo;
}

interface AddOnPricing {
  teamPortal: {
    price: number;
    name: string;
    description: string;
  };
}

const B2BSubscriptionCalculator: React.FC = () => {
  const [tierSeats, setTierSeats] = useState<TierSeats>({
    tier1: 0,
    tier2: 0,
    tier3: 0
  });
  
  const [addOns, setAddOns] = useState<AddOns>({
    teamPortal: false
  });
  
  const [additionalCourses, setAdditionalCourses] = useState<AdditionalCourses>({
    tier1: [],
    tier2: []
  });
  
  const [error, setError] = useState<string>('');
  
  const [calculations, setCalculations] = useState<Calculations>({
    subtotal: 0,
    discount: 0,
    discountRate: 0,
    addOnsTotal: 0,
    additionalCoursesTotal: 0,
    additionalCoursesDetails: {},
    finalTotal: 0,
    totalSeats: 0,
    discountNote: ''
  });

const tierPricing: TierPricing = {
  tier1: { price: 75, name: 'Tier 1: Awareness', description: 'Basic access to up to $50 courses' },
  tier2: { price: 149, name: 'Tier 2: Professional', description: 'Competent Person & Technical Training up to $150' },
  tier3: { price: 249, name: 'Tier 3: Total Access', description: 'Full catalog including OSHA 30, HAZWOPER, DOT Haz' }
};

const addOnPricing: AddOnPricing = {
  teamPortal: { price: 500, name: 'Team Portal', description: 'Advanced team management features' }
};

  const getDiscountRate = (totalSeats: number): number => {
    if (totalSeats >= 1000) return 0.75;  // 75% discount for 1000+ seats
    if (totalSeats >= 500) return 0.60;   // 60% discount for 500-999 seats
    if (totalSeats >= 250) return 0.45;   // 45% discount for 250-499 seats
    if (totalSeats >= 100) return 0.35;   // 35% discount for 100-249 seats
    if (totalSeats >= 50) return 0.25;    // 25% discount for 50-99 seats
    return 0;
  };

  useEffect(() => {
    try {
      setError('');
      const totalSeats = (Object.values(tierSeats) as number[]).reduce((sum: number, seats: number) => sum + seats, 0);
      
      // Calculate tier subtotals
      const tierSubtotals = {
        tier1: tierSeats.tier1 * tierPricing.tier1.price,
        tier2: tierSeats.tier2 * tierPricing.tier2.price,
        tier3: tierSeats.tier3 * tierPricing.tier3.price
      };
      
      const subtotal = (Object.values(tierSubtotals) as number[]).reduce((sum: number, price: number) => sum + price, 0);
      const discountRate = getDiscountRate(totalSeats);
      const discount = subtotal * discountRate;
      const addOnsTotal = addOns.teamPortal ? addOnPricing.teamPortal.price : 0;
      
      // Calculate pay-as-you-go courses - COMPLETELY SEPARATE from seat count
      let additionalCoursesTotal = 0;
      const additionalCoursesDetails: Calculations['additionalCoursesDetails'] = {};
    
    // Tier 1 subscribers get 30% off pay-as-you-go courses
    if (tierSeats.tier1 > 0 && additionalCourses.tier1.length > 0) {
      const courseCosts = additionalCourses.tier1.map((course: Course) => {
        const price = Math.max(0, parseFloat(course.price) || 0);
        const qty = Math.max(0, parseInt(course.quantity.toString(), 10) || 0);
        const baseTotal = price * qty;  // Just price × quantity, NO seat multiplication
        return {
          ...course,
          totalCost: baseTotal,
          discountedCost: baseTotal * 0.7  // Apply 30% discount
        };
      });
      
      const totalOriginal = courseCosts.reduce((sum: number, c: CourseCalculation) => sum + c.totalCost, 0);
      const totalDiscounted = courseCosts.reduce((sum: number, c: CourseCalculation) => sum + c.discountedCost, 0);
      
      additionalCoursesDetails.tier1 = {
        courses: courseCosts,
        original: totalOriginal,
        discounted: totalDiscounted,
        saved: totalOriginal - totalDiscounted,
        discount: '30%'
      };
      additionalCoursesTotal += totalDiscounted;
    }
    
    // Tier 2 subscribers get 50% off pay-as-you-go courses
    if (tierSeats.tier2 > 0 && additionalCourses.tier2.length > 0) {
      const courseCosts = additionalCourses.tier2.map((course: Course) => {
        const price = Math.max(0, parseFloat(course.price) || 0);
        const qty = Math.max(0, parseInt(course.quantity.toString(), 10) || 0);
        const baseTotal = price * qty;  // Just price × quantity, NO seat multiplication
        return {
          ...course,
          totalCost: baseTotal,
          discountedCost: baseTotal * 0.5  // Apply 50% discount
        };
      });
      
      const totalOriginal = courseCosts.reduce((sum: number, c: CourseCalculation) => sum + c.totalCost, 0);
      const totalDiscounted = courseCosts.reduce((sum: number, c: CourseCalculation) => sum + c.discountedCost, 0);
      
      additionalCoursesDetails.tier2 = {
        courses: courseCosts,
        original: totalOriginal,
        discounted: totalDiscounted,
        saved: totalOriginal - totalDiscounted,
        discount: '50%'
      };
      additionalCoursesTotal += totalDiscounted;
    }
    
    const finalTotal = subtotal - discount + addOnsTotal + additionalCoursesTotal;
    
    let discountNote = '';
    if (discountRate > 0) {
      discountNote = `${(discountRate * 100).toFixed(0)}% Volume Discount Applied`;
    } else if (totalSeats > 0 && totalSeats < 50) {
      discountNote = `Add ${50 - totalSeats} more seats to qualify for volume discount`;
    }
    
    setCalculations({
      subtotal,
      discount,
      discountRate,
      addOnsTotal,
      additionalCoursesTotal,
      additionalCoursesDetails,
      finalTotal,
      totalSeats,
      discountNote,
      tierSubtotals
    });
    } catch (err) {
      setError('An error occurred while calculating totals. Please check your inputs.');
      console.error('Calculation error:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierSeats, addOns, additionalCourses]);

  const handleSeatChange = (tier: keyof TierSeats, value: string): void => {
    const numValue = Math.min(10000, Math.max(0, parseInt(value, 10) || 0)); // Max 10,000 seats
    setTierSeats((prev: TierSeats) => ({
      ...prev,
      [tier]: numValue
    }));
  };

  const addCourse = (tier: keyof AdditionalCourses): void => {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: '',
      price: '',
      quantity: 1
    };
    
    setAdditionalCourses((prev: AdditionalCourses) => ({
      ...prev,
      [tier]: [...prev[tier], newCourse]
    }));
  };

  const updateCourse = useCallback((tier: keyof AdditionalCourses, courseId: string, field: keyof Course, value: string | number): void => {
    let validatedValue = value;
    
    // Validate based on field type
    if (field === 'price') {
      const priceStr = value.toString();
      // Allow only numbers and decimal point, limit to 2 decimal places
      if (priceStr && !/^\d*\.?\d{0,2}$/.test(priceStr)) return;
      const priceNum = parseFloat(priceStr);
      if (priceNum > 100000) return; // Max $100,000 per course
    } else if (field === 'quantity') {
      const qtyNum = parseInt(value.toString(), 10) || 0;
      validatedValue = Math.min(10000, Math.max(1, qtyNum)); // 1-10,000 range
    } else if (field === 'name') {
      validatedValue = value.toString().slice(0, 100); // Max 100 characters
    }
    
    setAdditionalCourses((prev: AdditionalCourses) => ({
      ...prev,
      [tier]: prev[tier].map((course: Course) =>
        course.id === courseId
          ? { ...course, [field]: validatedValue }
          : course
      )
    }));
  }, []);

  const removeCourse = (tier: keyof AdditionalCourses, courseId: string): void => {
    setAdditionalCourses((prev: AdditionalCourses) => ({
      ...prev,
      [tier]: prev[tier].filter((course: Course) => course.id !== courseId)
    }));
  };

  const handleExportPDF = (): void => {
    if (calculations.totalSeats === 0) {
      setError('Please add at least one seat before exporting.');
      return;
    }
    alert('PDF export functionality would be implemented here using jsPDF or similar library');
  };

  const handleSendToSales = (): void => {
    if (calculations.totalSeats === 0) {
      setError('Please add at least one seat before sending to sales.');
      return;
    }
    alert('Send to Sales functionality would be implemented here with CRM integration');
  };

  const formatCurrency = (amount: number, showCents: boolean = false): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">B2B Subscription Calculator</h1>
          </div>
          <p className="text-gray-600">
            Configure your enterprise subscription with tier-based seat allocation and automatic volume discounts
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3" role="alert">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Seat Allocation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Step 1: Allocate Employee Seats</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(tierPricing).map(([key, tier]) => (
                  <div key={key} className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-800">{tier.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                        <p className="text-lg font-semibold text-indigo-600 mt-2">
                          {formatCurrency(tier.price)} per employee/year
                        </p>
                      </div>
                      <div>
                        <label htmlFor={`seats-${key}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Seats
                        </label>
                        <input
                          id={`seats-${key}`}
                          type="number"
                          min="0"
                          max="10000"
                          value={tierSeats[key as keyof TierSeats]}
                          onChange={(e) => handleSeatChange(key as keyof TierSeats, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0"
                          aria-label={`Number of seats for ${tier.name}`}
                          aria-describedby={`${key}-description`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-center text-lg font-semibold text-indigo-700">
                  Total Seats: {calculations.totalSeats}
                </p>
              </div>
            </div>

            {/* Step 2: Add-ons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Step 2: Select Add-ons</h2>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="addon-team-portal" className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    id="addon-team-portal"
                    type="checkbox"
                    checked={addOns.teamPortal}
                    onChange={(e) => setAddOns({ ...addOns, teamPortal: e.target.checked })}
                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    aria-label="Add Team Portal add-on"
                    aria-describedby="addon-team-portal-description"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{addOnPricing.teamPortal.name}</h3>
                      <span className="font-semibold text-indigo-600">
                        +{formatCurrency(addOnPricing.teamPortal.price)}/year
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{addOnPricing.teamPortal.description}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Pay-As-You-Go Courses */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Step 3: Pay-As-You-Go Course Purchases</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Calculate additional pay-as-you-go course purchases separately from your subscription. 
                Enter the price per course and total quantity needed. Discounts apply automatically based on your subscription tier 
                (30% off for Tier 1, 50% off for Tier 2).
              </p>

              {/* Tier 1 Additional Courses */}
              {tierSeats.tier1 > 0 && (
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Tier 1 Subscription Active - 30% discount on all pay-as-you-go courses
                    </h3>
                    <button
                      onClick={() => addCourse('tier1')}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Course
                    </button>
                  </div>
                  
                  {additionalCourses.tier1.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No courses added yet. Click "Add Course" to start.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center text-xs text-gray-500 mb-1">
                        <span className="flex-1">Course Name</span>
                        <span className="w-24">Price/Course</span>
                        <span className="w-20">Total Qty</span>
                        <span className="w-8"></span>
                      </div>
                      {additionalCourses.tier1.map((course) => (
                        <div key={course.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Course name"
                            value={course.name}
                            maxLength={100}
                            onChange={(e) => updateCourse('tier1', course.id, 'name', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Course name for Tier 1"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100000"
                            placeholder="$"
                            value={course.price}
                            onChange={(e) => updateCourse('tier1', course.id, 'price', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Price per course for Tier 1"
                          />
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            placeholder="#"
                            value={course.quantity}
                            onChange={(e) => updateCourse('tier1', course.id, 'quantity', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Quantity for Tier 1 course"
                          />
                          <button
                            onClick={() => removeCourse('tier1', course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            aria-label={`Remove course ${course.name || 'from list'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-green-600 mt-2" role="status">
                        30% discount applied • Example: $129 × 5 = $645, with discount = $451.50
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tier 2 Additional Courses */}
              {tierSeats.tier2 > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Tier 2 Subscription Active - 50% discount on all pay-as-you-go courses
                    </h3>
                    <button
                      onClick={() => addCourse('tier2')}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Course
                    </button>
                  </div>
                  
                  {additionalCourses.tier2.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No courses added yet. Click "Add Course" to start.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center text-xs text-gray-500 mb-1">
                        <span className="flex-1">Course Name</span>
                        <span className="w-24">Price/Course</span>
                        <span className="w-20">Total Qty</span>
                        <span className="w-8"></span>
                      </div>
                      {additionalCourses.tier2.map((course) => (
                        <div key={course.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Course name"
                            value={course.name}
                            maxLength={100}
                            onChange={(e) => updateCourse('tier2', course.id, 'name', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Course name for Tier 2"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100000"
                            placeholder="$"
                            value={course.price}
                            onChange={(e) => updateCourse('tier2', course.id, 'price', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Price per course for Tier 2"
                          />
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            placeholder="#"
                            value={course.quantity}
                            onChange={(e) => updateCourse('tier2', course.id, 'quantity', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.preventDefault();
                            }}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Quantity for Tier 2 course"
                          />
                          <button
                            onClick={() => removeCourse('tier2', course.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            aria-label={`Remove course ${course.name || 'from list'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-green-600 mt-2" role="status">
                        50% discount applied • Example: $129 × 5 = $645, with discount = $322.50
                      </p>
                    </div>
                  )}
                </div>
              )}

              {tierSeats.tier1 === 0 && tierSeats.tier2 === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Add Tier 1 or Tier 2 seats to unlock discounted pay-as-you-go course purchases
                </p>
              )}
              
              {tierSeats.tier3 > 0 && tierSeats.tier1 === 0 && tierSeats.tier2 === 0 && (
                <p className="text-amber-600 text-center py-4 bg-amber-50 rounded-lg">
                  Tier 3 subscribers have full catalog access - no additional course purchases needed
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Cost Summary</h2>
              </div>
              
              {/* Tier Breakdown */}
              {calculations.totalSeats > 0 && (
                <div className="space-y-2 mb-4 pb-4 border-b">
                  {Object.entries(tierSeats).map(([key, seats]) => {
                    if (seats === 0) return null;
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {tierPricing[key as keyof TierPricing].name.split(':')[1]} ({seats} seats)
                        </span>
                        <span className="font-medium">
                          {formatCurrency(seats * tierPricing[key as keyof TierPricing].price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(calculations.subtotal)}</span>
                </div>
                
                {calculations.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Volume Discount</span>
                    <span className="font-semibold">-{formatCurrency(calculations.discount)}</span>
                  </div>
                )}
                
                {calculations.addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold">+{formatCurrency(calculations.addOnsTotal)}</span>
                  </div>
                )}
                
                {/* Additional Courses Breakdown */}
                {calculations.additionalCoursesTotal > 0 && (
                  <>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Pay-As-You-Go Courses:</p>
                      {Object.entries(calculations.additionalCoursesDetails).map(([key, details]) => {
                        const label = key === 'tier1' ? 'With Tier 1 Discount (30% off)' : 'With Tier 2 Discount (50% off)';
                        return (
                          <div key={key} className="ml-2 text-sm space-y-1 mb-2">
                            <div className="text-xs text-gray-500">{label}</div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Original Price</span>
                              <span className="line-through text-gray-400">{formatCurrency(details.original)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">After Discount</span>
                              <span className="font-medium">{formatCurrency(details.discounted)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-green-600">
                              <span>You Save</span>
                              <span>{formatCurrency(details.saved)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-semibold text-gray-800">Annual Total</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(calculations.finalTotal)}
                    </span>
                  </div>
                </div>
                
                {calculations.discountNote && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-700 text-center font-medium">
                      {calculations.discountNote}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleExportPDF}
                  disabled={calculations.totalSeats === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  aria-label="Download quote as PDF"
                >
                  <Download className="w-4 h-4" />
                  Download Quote PDF
                </button>
                <button
                  onClick={handleSendToSales}
                  disabled={calculations.totalSeats === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                  aria-label="Send quote to sales team"
                >
                  <Send className="w-4 h-4" />
                  Send to Sales Team
                </button>
              </div>
              
              {/* Disclaimer */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                This is an estimate and subject to final sales agreement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSubscriptionCalculator;