/**
 * api.js – RideSync Frontend API Client
 *
 * Central module for all backend communication.
 * Automatically attaches the JWT token from localStorage
 * and provides consistent error handling.
 *
 * Usage:
 *   <script src="api.js"></script>
 *   const user = await API.auth.login(email, password);
 */

(function (window) {

  // ------------------------------------------------------------------
  // CONFIG
  // ------------------------------------------------------------------

  const BASE_URL = "http://localhost:5000/api";

  // localStorage keys
  const TOKEN_KEY   = "rs_token";
  const USER_KEY    = "rs_user";
  const ROLE_KEY    = "rs_role";


  // ------------------------------------------------------------------
  // CORE HTTP HELPER
  // ------------------------------------------------------------------

  async function request(method, path, body, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const config = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(`${BASE_URL}${path}`, config);

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data   = data;
      throw err;
    }

    return data;
  }

  const get    = (path, opts)       => request("GET",    path, null, opts);
  const post   = (path, body, opts) => request("POST",   path, body, opts);
  const put    = (path, body, opts) => request("PUT",    path, body, opts);
  const patch  = (path, body, opts) => request("PATCH",  path, body, opts);
  const del    = (path, opts)       => request("DELETE", path, null, opts);


  // ------------------------------------------------------------------
  // SESSION HELPERS
  // ------------------------------------------------------------------

  function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, user.role || "EMPLOYEE");

    // Keep legacy ridesync_* keys so existing page checks still work
    localStorage.setItem("ridesync_logged_in",    "true");
    localStorage.setItem("ridesync_role",          (user.role || "employee").toLowerCase());
    localStorage.setItem("ridesync_current_user",  JSON.stringify(user));
  }

  function clearSession() {
    [TOKEN_KEY, USER_KEY, ROLE_KEY,
     "ridesync_logged_in", "ridesync_role", "ridesync_current_user"
    ].forEach(k => localStorage.removeItem(k));
  }

  function getToken()   { return localStorage.getItem(TOKEN_KEY); }
  function getUser()    {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch { return null; }
  }
  function isLoggedIn() { return !!getToken(); }

  /**
   * Guard helper — call at top of protected pages.
   * Redirects to login if there is no token.
   */
  function requireAuth(redirectTo = "login.html") {
    if (!isLoggedIn()) {
      window.location.href = redirectTo;
    }
  }


  // ------------------------------------------------------------------
  // AUTH
  // ------------------------------------------------------------------

  const auth = {

    /**
     * Register a new employee.
     * Returns { token, user }
     */
    async register({ name, email, password, phone, organizationCode }) {
      const data = await post("/auth/register", {
        name,
        email,
        password,
        phone,
        organizationCode,
      });
      // Backend wraps response as { success, data: { user, token } }
      const payload = data.data || data;
      if (payload.token && payload.user) {
        saveSession(payload.token, payload.user);
      }
      return data;
    },

    /**
     * Login existing user.
     * Returns { token, user }
     */
    async login(email, password) {
      const data = await post("/auth/login", { email, password });
      // Backend wraps response as { success, data: { user, token } }
      const payload = data.data || data;
      if (payload.token && payload.user) {
        saveSession(payload.token, payload.user);
      }
      return data;
    },

    /**
     * Get the currently authenticated user from the server.
     */
    async me() {
      return get("/auth/me");
    },

    /**
     * Logout current user.
     */
    async logout() {
      try { await post("/auth/logout", {}); } catch (_) {}
      clearSession();
      window.location.href = "login.html";
    },

  };


  // ------------------------------------------------------------------
  // RIDES
  // ------------------------------------------------------------------

  const rides = {

    /**
     * Create / offer a new ride (driver).
     */
    async create(rideData) {
      return post("/rides", rideData);
    },

    /**
     * Search available rides.
     * @param {{ from, to, date, seats }} params
     */
    async search(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return get(`/rides?${qs}`);
    },

    /**
     * Get all available rides for the user's org.
     */
    async available() {
      return get("/rides/available");
    },

    /**
     * Get rides created by the current user.
     */
    async myRides() {
      return get("/rides/my");
    },

    /**
     * Get details for a specific ride.
     */
    async getById(rideId) {
      return get(`/rides/${rideId}`);
    },

    /**
     * Cancel a ride.
     */
    async cancel(rideId) {
      return del(`/rides/${rideId}`);
    },

    /**
     * Update ride status.
     */
    async updateStatus(rideId, status) {
      return patch(`/rides/${rideId}/status`, { status });
    },

  };


  // ------------------------------------------------------------------
  // BOOKINGS
  // ------------------------------------------------------------------

  const bookings = {

    /**
     * Book a ride (passenger).
     */
    async create(rideId, seats = 1) {
      return post("/bookings", { rideId, seats });
    },

    /**
     * Get my bookings.
     */
    async myBookings(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return get(`/bookings/my?${qs}`);
    },

    /**
     * Get a booking by ID.
     */
    async getById(bookingId) {
      return get(`/bookings/${bookingId}`);
    },

    /**
     * Cancel a booking.
     */
    async cancel(bookingId) {
      return del(`/bookings/${bookingId}`);
    },

  };


  // ------------------------------------------------------------------
  // PAYMENTS
  // ------------------------------------------------------------------

  const payments = {

    /**
     * Create a payment for a completed trip.
     * @param {{ tripId, paymentMethod }} opts
     */
    async create({ tripId, paymentMethod }) {
      return post("/payments", { tripId, paymentMethod });
    },

    /**
     * Create a PayPal order.
     */
    async createPaypalOrder({ tripId, amount }) {
      return post("/payments/paypal/order", { tripId, amount });
    },

    /**
     * Capture a PayPal payment after user approval.
     */
    async capturePaypal({ paymentId, paypalOrderId }) {
      return post("/payments/paypal/capture", { paymentId, paypalOrderId });
    },

    /**
     * Get my payment history.
     */
    async myPayments(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return get(`/payments?${qs}`);
    },

    /**
     * Refund a payment.
     */
    async refund(paymentId, reason = "") {
      return post(`/payments/${paymentId}/refund`, { reason });
    },

  };


  // ------------------------------------------------------------------
  // VEHICLES
  // ------------------------------------------------------------------

  const vehicles = {

    /**
     * Register a vehicle.
     */
    async create(vehicleData) {
      return post("/vehicles", vehicleData);
    },

    /**
     * Get my vehicles.
     */
    async myVehicles() {
      return get("/vehicles/my");
    },

    /**
     * Get a vehicle by ID.
     */
    async getById(vehicleId) {
      return get(`/vehicles/${vehicleId}`);
    },

    /**
     * Update a vehicle.
     */
    async update(vehicleId, vehicleData) {
      return put(`/vehicles/${vehicleId}`, vehicleData);
    },

  };


  // ------------------------------------------------------------------
  // USER
  // ------------------------------------------------------------------

  const users = {

    /**
     * Get current user profile.
     */
    async profile() {
      return get("/users/me");
    },

    /**
     * Update profile.
     */
    async updateProfile(data) {
      return put("/users/me", data);
    },

  };


  // ------------------------------------------------------------------
  // WALLET
  // ------------------------------------------------------------------

  const wallet = {

    /**
     * Get wallet balance.
     */
    async get() {
      return get("/wallet");
    },

    /**
     * Get wallet transaction history.
     */
    async transactions(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return get(`/wallet/transactions?${qs}`);
    },

  };


  // ------------------------------------------------------------------
  // TRACKING
  // ------------------------------------------------------------------

  const tracking = {

    /**
     * Get live location for a trip.
     */
    async getLiveLocation(tripId) {
      return get(`/tracking/${tripId}/live`);
    },

  };


  // ------------------------------------------------------------------
  // HISTORY
  // ------------------------------------------------------------------

  const history = {

    async get(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return get(`/history?${qs}`);
    },

  };


  // ------------------------------------------------------------------
  // TOAST NOTIFICATION (UI helper)
  // ------------------------------------------------------------------

  function toast(message, type = "info", duration = 3500) {
    // Remove existing toasts
    document.querySelectorAll(".rs-api-toast").forEach(el => el.remove());

    const colors = {
      info:    { bg: "#1a56db", icon: "ℹ️" },
      success: { bg: "#057a55", icon: "✅" },
      error:   { bg: "#c81e1e", icon: "❌" },
      warning: { bg: "#b45309", icon: "⚠️" },
    };

    const { bg, icon } = colors[type] || colors.info;

    const el = document.createElement("div");
    el.className = "rs-api-toast";
    el.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${bg};
      color: #fff;
      padding: 14px 20px;
      border-radius: 10px;
      font-family: Inter, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 360px;
      line-height: 1.4;
      animation: rsToastIn .25s ease;
    `;
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    // Inject keyframe if not already present
    if (!document.getElementById("rs-toast-style")) {
      const style = document.createElement("style");
      style.id = "rs-toast-style";
      style.textContent = `
        @keyframes rsToastIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }


  // ------------------------------------------------------------------
  // EXPOSE GLOBAL API OBJECT
  // ------------------------------------------------------------------

  window.API = {
    BASE_URL,
    auth,
    rides,
    bookings,
    payments,
    vehicles,
    users,
    wallet,
    tracking,
    history,

    // Helpers
    getToken,
    getUser,
    isLoggedIn,
    requireAuth,
    saveSession,
    clearSession,
    toast,
  };

})(window);
