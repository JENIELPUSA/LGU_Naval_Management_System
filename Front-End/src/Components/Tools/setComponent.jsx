import { useState } from 'react';

// Main App component
const App = () => {
  // Define seat data with status and row/seat numbers
  const initialSeats = [
    // Row A (Premium)
    { id: 1, row: 'A', number: 1, status: 'available', type: 'premium' },
    { id: 2, row: 'A', number: 2, status: 'available', type: 'premium' },
    { id: 3, row: 'A', number: 3, status: 'available', type: 'premium' },
    { id: 4, row: 'A', number: 4, status: 'available', type: 'premium' },
    { id: 5, row: 'A', number: 5, status: 'occupied', type: 'premium' },
    { id: 6, row: 'A', number: 6, status: 'available', type: 'premium' },
    { id: 7, row: 'A', number: 7, status: 'available', type: 'premium' },
    { id: 8, row: 'A', number: 8, status: 'occupied', type: 'premium' },
    // Row B (Regular)
    { id: 9, row: 'B', number: 1, status: 'available', type: 'regular' },
    { id: 10, row: 'B', number: 2, status: 'available', type: 'regular' },
    { id: 11, row: 'B', number: 3, status: 'available', type: 'regular' },
    { id: 12, row: 'B', number: 4, status: 'occupied', type: 'regular' },
    { id: 13, row: 'B', number: 5, status: 'available', type: 'regular' },
    { id: 14, row: 'B', number: 6, status: 'available', type: 'regular' },
    { id: 15, row: 'B', number: 7, status: 'available', type: 'regular' },
    { id: 16, row: 'B', number: 8, status: 'available', type: 'regular' },
    // Row C (Regular)
    { id: 17, row: 'C', number: 1, status: 'occupied', type: 'regular' },
    { id: 18, row: 'C', number: 2, status: 'available', type: 'regular' },
    { id: 19, row: 'C', number: 3, status: 'available', type: 'regular' },
    { id: 20, row: 'C', number: 4, status: 'available', type: 'regular' },
    { id: 21, row: 'C', number: 5, status: 'available', type: 'regular' },
    { id: 22, row: 'C', number: 6, status: 'available', type: 'regular' },
    { id: 23, row: 'C', number: 7, status: 'occupied', type: 'regular' },
    { id: 24, row: 'C', number: 8, status: 'available', type: 'regular' },
  ];

  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPrices, setShowPrices] = useState(true);

  const seatPrices = {
    premium: 400,
    regular: 250
  };

  // Handle seat click function
  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);

    if (seat.status === 'occupied') {
      return;
    }

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!showPrices) return 0; // Free when prices are disabled
    return selectedSeatIds.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + seatPrices[seat.type];
    }, 0);
  };

  const totalPrice = calculateTotal();

  // Get selected seat details
  const getSelectedSeats = () => {
    return selectedSeatIds.map(id => seats.find(s => s.id === id));
  };

  const handleConfirmation = () => {
    if (selectedSeatIds.length > 0) {
      setShowConfirmation(true);
      // In a real app, this would trigger booking API call
      setTimeout(() => {
        // Update seats to occupied
        const updatedSeats = seats.map(seat => 
          selectedSeatIds.includes(seat.id) 
            ? { ...seat, status: 'occupied' }
            : seat
        );
        setSeats(updatedSeats);
        setSelectedSeatIds([]);
        setShowConfirmation(false);
        alert(showPrices ? 'Seats successfully reserved!' : 'Free seats successfully obtained!');
      }, 2000);
    }
  };

  const clearSelection = () => {
    setSelectedSeatIds([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Seat Selection System
            </h1>
            <p className="text-slate-600">Choose your preferred seats for the event</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Theater Screen Representation */}
            <div className="bg-slate-800 text-white text-center py-4 mb-8">
              <div className="max-w-md mx-auto">
                <div className="bg-slate-700 rounded-t-3xl py-2 mb-2">
                  <span className="text-sm font-medium">STAGE / SCREEN</span>
                </div>
                <div className="text-xs text-slate-300">← Left Side | Right Side →</div>
              </div>
            </div>

            <div className="px-8 pb-8">
              {/* Legend and Price Toggle */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 p-4 bg-slate-50 rounded-lg">
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-slate-300 border-2 border-slate-400"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Available {showPrices && '(₱250)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-amber-200 border-2 border-amber-400"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Premium {showPrices && '(₱400)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500 border-2 border-emerald-600"></div>
                    <span className="text-sm font-medium text-slate-700">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-red-500 border-2 border-red-600"></div>
                    <span className="text-sm font-medium text-slate-700">Unavailable</span>
                  </div>
                </div>
                
                {/* Price Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">Show Prices:</span>
                  <button
                    onClick={() => setShowPrices(!showPrices)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      showPrices ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        showPrices ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Seating Grid */}
              <div className="flex flex-col items-center gap-3">
                {/* Column headers */}
                <div className="flex gap-3 mb-4 pl-12">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(number => (
                    <div key={`header-${number}`} className="w-12 text-center">
                      <span className="text-sm font-semibold text-slate-500">{number}</span>
                    </div>
                  ))}
                </div>

                {/* Seat rows */}
                {['A', 'B', 'C'].map(row => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      <span className="text-xl font-bold text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                        {row}
                      </span>
                    </div>
                    
                    {seats.filter(seat => seat.row === row).map(seat => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isOccupied = seat.status === 'occupied';
                      const isPremium = seat.type === 'premium';
                      
                      let seatClass = 'w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 border-2 relative group';

                      if (isOccupied) {
                        seatClass += ' bg-red-500 border-red-600 text-white cursor-not-allowed';
                      } else if (isSelected) {
                        seatClass += ' bg-emerald-500 border-emerald-600 text-white transform scale-110 shadow-lg';
                      } else if (isPremium) {
                        seatClass += ' bg-amber-200 border-amber-400 text-amber-800 hover:bg-amber-300 hover:scale-105 shadow-md';
                      } else {
                        seatClass += ' bg-slate-300 border-slate-400 text-slate-700 hover:bg-slate-400 hover:text-white hover:scale-105';
                      }

                      return (
                        <div key={seat.id} className="relative">
                          <div
                            className={seatClass}
                            onClick={() => handleSeatClick(seat.id)}
                          >
                            <span className="text-xs font-bold">{seat.number}</span>
                            
                            {/* Tooltip */}
                            {!isOccupied && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                {seat.row}{seat.number}{showPrices && ` - ₱${seatPrices[seat.type]}`}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Selection Summary */}
              {selectedSeatIds.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <h3 className="text-lg font-bold text-emerald-800 mb-4">Selected Seats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {getSelectedSeats().map(seat => (
                      <div key={seat.id} className="text-center p-2 bg-white rounded border">
                        <div className="font-semibold text-slate-700">{seat.row}{seat.number}</div>
                        {showPrices && <div className="text-sm text-slate-600">₱{seatPrices[seat.type]}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-emerald-700">
                        <span className="font-semibold">{selectedSeatIds.length}</span> seat(s) selected
                      </p>
                      {showPrices ? (
                        <p className="text-2xl font-bold text-emerald-800">
                          Total Amount: ₱{totalPrice.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-emerald-800">
                          No Payment Required - Free!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                {selectedSeatIds.length > 0 && (
                  <button
                    className="px-6 py-3 bg-slate-400 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors duration-200"
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </button>
                )}
                
                <button
                  className={`px-8 py-3 font-bold rounded-lg transition-all duration-200 ${
                    selectedSeatIds.length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : showConfirmation
                        ? 'bg-amber-500 text-white'
                        : showPrices
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                  disabled={selectedSeatIds.length === 0 || showConfirmation}
                  onClick={handleConfirmation}
                >
                  {showConfirmation ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {showPrices ? 'Processing Reservation...' : 'Processing Free Booking...'}
                    </div>
                  ) : showPrices ? (
                    'Confirm Reservation'
                  ) : (
                    'Get Free Seats'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;