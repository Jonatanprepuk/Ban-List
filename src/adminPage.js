import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"

export default function AdminPage() {
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [subsidiariesList, setSubsidiariesList] = useState([]);
    const [subsidiaryInput, setSubsidiaryInput] = useState('');

    const [suggestions, setSuggestions] = useState([]);

  
    const handleUpload = async (e) => {
      e.preventDefault();
  
      // Kontrollera om companyName eller description är tomma
      if (!companyName.trim() || !description.trim()) {
        alert('Company name or description cannot be empty.');
        return;
      }
      
      const companyData = {
        name: companyName,
        description: description,
        subsidiaries: subsidiariesList
      };
  
      // Lägg till företagsdata till Firebase Firestore
      const companyRef = doc(collection(db, "companies"), companyName);
      await setDoc(companyRef, companyData);
  
      // Återställ formuläret
      setCompanyName('');
      setDescription('');
      setSubsidiariesList([]);
    };

    const acceptUpload = async (suggest) => {
        const companyData = {
            name: suggest.name,
            description: suggest.description,
            subsidiaries: suggest.subsidiaries
        };
    
        const companyRef = doc(collection(db, "companies"), suggest.name);
        await setDoc(companyRef, companyData);

        // Ta bort förslaget från "suggestions" i Firestore
        const suggestionRef = doc(collection(db, "suggestions"), suggest.name);
        await deleteDoc(suggestionRef);

        // Filtrera ut det accepterade förslaget från suggestions state
        const updatedSuggestions = suggestions.filter(s => s.name !== suggest.name);
        setSuggestions(updatedSuggestions);
    }

    const rejectUpload = async (suggest) => {

        const suggestionRef = doc(collection(db, "suggestions"), suggest.name);
        await deleteDoc(suggestionRef);

        const updatedSuggestions = suggestions.filter(s => s.name !== suggest.name);
        setSuggestions(updatedSuggestions);
    }
    

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const suggestionsCollection = collection(db, "suggestions");
                const suggestionsSnapshot = await getDocs(suggestionsCollection);
                const suggestionsList = suggestionsSnapshot.docs.map(doc => doc.data());
                setSuggestions(suggestionsList);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
    
        fetchSuggestions();
    }, []);
    
  
    const addSubsidiaryToList = () => {
      if (!subsidiaryInput.trim()) {
        alert('Subsidiary name cannot be empty.')
        return;
      }
      
      if (subsidiariesList.includes(subsidiaryInput)) {
        alert('This subsidiary is already added.')
        return;
      }
  
      setSubsidiariesList(prevList => {
        const newList = [...prevList, subsidiaryInput];
        return newList.sort((a, b) => a.localeCompare(b)); 
      });
      setSubsidiaryInput('');
    };
  
    const removeSubsidiary = (subsidiaryToRemove) => {
    setSubsidiariesList(prevList => prevList.filter(sub => sub !== subsidiaryToRemove));
  }
  
  
    return (
      <div className='dashboard'>
        <h1 className='dashboard-header'>Admin Dashboard</h1>
        <h2>Add Company to list</h2>
        <a href="/" className='back-button' onClick={() => document.querySelector('.App').scrollTop = 0}>	&larr;</a>
        <form onSubmit={handleUpload}>
          <input 
            className='company-input'
            type='text' 
            placeholder='Company Name' 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <textarea 
            className='description-input'
            placeholder='Description' 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
          <input 
            className='subsidiary-input'
            placeholder='Subsidiary Name'
            value={subsidiaryInput}
            onChange={(e) => setSubsidiaryInput(e.target.value)}
          />
          <button type="button" className='subsidiaries-add-button' onClick={addSubsidiaryToList}>Add Subsidiary</button>
          <ul>
            {subsidiariesList.map(sub => (
              <li className='subsidiaries-list' key={sub}>
                {sub}
                <button className="remove-subsidiary-button" onClick={() => removeSubsidiary(sub)}>&times;</button>
              </li>
            ))}
          </ul>
          
          <button className='input-submit' type="submit">Upload Data</button>
        </form>
        <h2>Suggested Companies</h2>
        <ul>
            {suggestions.map(suggest => (
                <div className='suggest' key={suggest.name}>
                    <h3>{suggest.name}</h3>
                    <p>{suggest.description}</p>
                    {suggest.subsidiaries.map(sub => (
                        <li key={sub}>
                            {sub}
                        </li>
                    ))}
                    <button className='accept-btn' onClick={() => acceptUpload(suggest)}>&#10004;</button>
                    <button className='reject-btn' onClick={() => rejectUpload(suggest)}>&#10006;</button>
                </div>
                
            ))}
        </ul>
      </div>
    );
  }