import { useState } from "react"
import { BannerSlider, Navbar } from "./components/layout"
import { Routes, Route } from "react-router-dom"
import { Home } from "./pages"

//redux
import { Provider } from "react-redux"
import store from "./redux/store"
function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Navbar />
        <div className="mt-6">
          <BannerSlider />
          <Routes>
            <Route path="/" element={<Home />} />{" "}
          </Routes>
        </div>
      </div>
    </Provider>
  )
}

export default App
