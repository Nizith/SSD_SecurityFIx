import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import CustomerDashboard from "./components/CustomerDashboard";
import RestaurantsAndFood from "./components/RestaurantsAndFood";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import TrackOrders from "./components/TrackOrders";
import RestaurantAdminDashboard from "./components/RestaurantAdminDashboard";
import DeliveryPersonnelDashboard from "./components/DeliveryPersonnelDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/customer-dashboard' element={<CustomerDashboard />} />
          <Route path='/restaurants-and-food' element={<RestaurantsAndFood />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/track-orders' element={<TrackOrders />} />
          <Route path='/restaurant-admin-dashboard' element={<RestaurantAdminDashboard />} />
          <Route path='/delivery-personnel-dashboard' element={<DeliveryPersonnelDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
