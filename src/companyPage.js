import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';


export default function CompanyPage({ companies }) {
    const { name } = useParams();
  
    const decodedName = decodeURIComponent(name);
  
    useEffect(() => {
      document.querySelector('.App').scrollTop = 0;
  }, []);
  
  const company = companies.find(company => company.name === decodedName);
  
    return (
      <div>
        <Link to="/" className='back-button' onClick={() => document.querySelector('.App').scrollTop = 0}>&larr;</Link>
        <h2 className='company-header'>{company.name}</h2>
        <div>{company.description && <p className='company-description'>{company.description}</p>}</div>
        
        {company.subsidiaries && company.subsidiaries.length > 0 && <h3 className='subsidiaries'>Subsidiaries</h3>}
  
        {company.subsidiaries && company.subsidiaries.sort((a, b) => a.localeCompare(b)).map((subsidiary, index) => (
          <p className='subsidiaries' key={index}>{subsidiary}</p>
        ))}
      </div>
    );
  }
  
  