import { useState } from 'react';
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"


export default function Suggestion(){

    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [subsidiariesList, setSubsidiariesList] = useState([]);
    const [subsidiaryInput, setSubsidiaryInput] = useState('');
  
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
      const companyRef = doc(collection(db, "suggestions"), companyName);
      await setDoc(companyRef, companyData);
  
      // Återställ formuläret
      setCompanyName('');
      setDescription('');
      setSubsidiariesList([]);
    };
  
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
        return newList.sort((a, b) => a.localeCompare(b));  // sortera listan i bokstavsordning
      });
      setSubsidiaryInput('');
    };
  
    const removeSubsidiary = (subsidiaryToRemove) => {
    setSubsidiariesList(prevList => prevList.filter(sub => sub !== subsidiaryToRemove));
  }
  
  
    return (
      <div className='dashboard'>
        <h2>Suggest companyt</h2>
        <a href="/" className='back-button' >	&larr;</a>
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
          
          <button className='input-submit' type="submit">Send suggest</button>
        </form>
      </div>
    );
}