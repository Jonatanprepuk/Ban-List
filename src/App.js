import './App.css';
import Login from './Login';
import AdminPage  from './adminPage'
import CompanyPage from './companyPage';
import Suggestion from './suggestion';

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"

import { useAuth } from "./authContext";
import { AuthProvider } from './authContext';

function AppWrapper(){
  return(
    <AuthProvider>
      <App/>
    </AuthProvider>
  )
}

function App() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyCollection = collection(db, "companies");
        const companySnapshot = await getDocs(companyCollection);
        const companyList = companySnapshot.docs.map(doc => doc.data());
        setCompanies(companyList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Ban List</h1>
        </header>
        

        <Routes>
          <Route path='/suggest' element={<Suggestion/>}/> 
          <Route path="/admin" element={!currentUser ? <Navigate to="/login" /> : <AdminPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={
            <div className="list-container">
              <input className='search-bar' type='text' placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(cleanString(e.target.value))}/>
              <Link className='suggest-btn' to="/suggest">Suggest new company</Link>
              {companies
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(company => cleanString(company.name).includes(searchTerm) ||
              (company.subsidiaries && company.subsidiaries.some(sub => cleanString(sub).includes(searchTerm)))) 
              .map(filteredCompany => (
                <Link className='link' to={`/${encodeURIComponent(filteredCompany.name)}`} key={filteredCompany.name}>
                  <div className="list-item">
                    {filteredCompany.name}
                  </div>
                </Link>
              ))}
            </div>
          } />
          <Route path="/:name" element={<CompanyPage companies={companies} />} />
        </Routes>
      </div>
    </Router>
  );
}

function cleanString(input) {
  return input
    .toLowerCase()
    .replace('&', 'and')
    .replace(/[^a-z0-9 ]/g, '');
}

export default AppWrapper;
