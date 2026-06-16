import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'
import Home from './pages/public/Home.jsx'

function App() {
  return (<div className="App">
      <Navbar 
        role="user"
        isAuthenticated={true}
      />
      <Home />
      
      <Footer />

    </div>
  )
}

export default App