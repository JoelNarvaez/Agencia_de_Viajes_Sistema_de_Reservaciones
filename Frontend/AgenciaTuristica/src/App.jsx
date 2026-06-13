import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'
import Home from './pages/public/Home.jsx'
import ReservationForm from './components/reservations/ReservationForm.jsx'

function App() {
  return (<div className="App">
      <Navbar 
        role="user"
        isAuthenticated={true}
      />
      <Home />
      
      <Footer />

        <ReservationForm
  onSubmit={(data) =>
    console.log(data)
  }
        />
    </div>
  )
}

export default App