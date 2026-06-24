/**
 * OTASyncEngine - Luxury Parity & Sync Module
 * Implements the "Antigravity" Strategy for direct booking optimization.
 * Coordinates simulated API hooks to Booking.com, Expedia, and Direct Parity adapters.
 */
class OTASyncEngine {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minute cache parity lock
    
    // Direct Channel commission margins saved: approx 15-20% OTA fee
    // We pass 10% savings back to the guest and keep 5-10% extra yield.
    this.directDiscountFactor = 0.90; 
    
    // Base standard rates (in INR) for Prayagraj premium inventory
    this.baseRates = {
      standard: 3499,
      premium: 4499,
      family: 5499
    };
  }

  /**
   * Mocking API call to OTA Endpoints (e.g., Expedia Rapid API, Booking.com Partner Center API)
   * In production, this resolves an edge function routing directly to OTA scraping or channel manager APIs.
   */
  async fetchRates(roomType, checkInDate) {
    const cacheKey = `${roomType}_${checkInDate}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheDuration) {
        console.log(`[OTA Sync] Serving cached rates for ${cacheKey}`);
        return cached.data;
      }
    }

    console.log(`[OTA Sync] Synchronizing dynamic inventory data for ${roomType} on ${checkInDate}...`);
    
    // Add small random noise to simulate dynamic OTA rate changes
    const seedRate = this.baseRates[roomType] || 5000;
    const noiseBooking = Math.floor((Math.random() * 300) - 100);
    const noiseExpedia = Math.floor((Math.random() * 250) - 120);

    const bookingRate = seedRate + noiseBooking;
    const expediaRate = seedRate + noiseExpedia;
    
    // Direct booking pricing logic (Apply parity logic + standard dynamic markup savings)
    const primaryOTA = Math.min(bookingRate, expediaRate);
    const directRate = Math.floor(primaryOTA * this.directDiscountFactor);
    const totalSavings = primaryOTA - directRate;

    const data = {
      roomType,
      checkInDate,
      rates: {
        bookingCom: bookingRate,
        expedia: expediaRate,
        direct: directRate
      },
      benefits: [
        "Best Rate Guaranteed",
        "Free High-Speed Wi-Fi",
        "Complimentary Buffet Breakfast at Golden Leaf Restaurant",
        "Welcome Cocktail on Arrival"
      ],
      savings: totalSavings,
      timestamp: Date.now()
    };

    this.cache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
  }

  /**
   * Sync and render UI parity nodes
   */
  async syncParityUI(roomType, checkInDate = 'today') {
    try {
      const data = await this.fetchRates(roomType, checkInDate);
      
      const bookingComElement = document.getElementById('rate-bookingcom');
      const expediaElement = document.getElementById('rate-expedia');
      const directElement = document.getElementById('rate-direct');
      const savingsElement = document.getElementById('savings-value');
      
      if (bookingComElement) {
        bookingComElement.innerText = `₹${data.rates.bookingCom.toLocaleString('en-IN')}`;
      }
      if (expediaElement) {
        expediaElement.innerText = `₹${data.rates.expedia.toLocaleString('en-IN')}`;
      }
      if (directElement) {
        directElement.innerText = `₹${data.rates.direct.toLocaleString('en-IN')}`;
      }
      if (savingsElement) {
        savingsElement.innerText = `₹${data.savings.toLocaleString('en-IN')}`;
      }

      // Dispatch event for other components (like booking form) to listen to
      const event = new CustomEvent('rateSyncComplete', { detail: data });
      window.dispatchEvent(event);
      
      console.log(`[OTA Sync] Parity update successful. Save Margin: ₹${data.savings}`);
    } catch (error) {
      console.error("[OTA Sync] Failed to synchronize rates across channels:", error);
    }
  }
}

// Instantiate globally
window.otaSync = new OTASyncEngine();
