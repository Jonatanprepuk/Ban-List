import './App.css';

import Login from './Login';
import AdminPage from './adminPage';
import CompanyPage from './companyPage';
import Suggestion from './suggestion';
import PageWrapper from './PageWrapper';

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useAuth } from "./authContext";
import { AuthProvider } from './authContext';
import { AnimatePresence, motion } from 'framer-motion';

function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

const initialAnimation = {
  hidden: { opacity: 0, x: -200 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 200 }
};

function App() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const location = useLocation();

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

  const cleanString = (input) => {
    return input.toLowerCase().replace('&', 'and').replace(/[^a-z0-9 ]/g, '');
  };

  return (
    <div className="App">
      <motion.header 
        className="App-header"
        variants={initialAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <h1>Ban List</h1>
      </motion.header>

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path='/suggest' element={<PageWrapper><Suggestion /></PageWrapper>} />
          <Route path="/admin" element={!currentUser ? <PageWrapper><Navigate to="/login" /></PageWrapper> : <PageWrapper><AdminPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/" element={
            <PageWrapper>
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
            </PageWrapper>
          } />
          <Route path="/:name" element={<PageWrapper><CompanyPage companies={companies} /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default AppWrapper;
