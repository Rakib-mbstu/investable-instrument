import React, { useEffect, useState } from 'react';
import InstrumentCard from './InstrumentCard';
import { fetchInstruments, fetchOwnedInstruments } from '../api/api';
import ReceiptViewer from './ReceiptViewer';

function Homepage() {
  const [instruments, setInstruments] = useState([]);
  const [ownedInstruments,setOwnedInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);

  useEffect(() => {
    setReceiptUrl(`http://localhost:3000/uploads/1748035344347-758877820.pdf`);
    fetchInstruments()
      .then(data => {
        console.log(data);
        setInstruments(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load instruments');
        setLoading(false);
      });
  }, []);

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      fetchOwnedInstruments()
      .then(items=>{
        setOwnedInstruments(items)
        setLoading(false);
      })
    }
  },[])

  return (
    <div>
      <h1>Investment Instruments</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {ownedInstruments.length > 0 && <div>
        <h1>Owned Investment Instruments</h1>
          <div className="instrument-list">
            {ownedInstruments.map(instrument => (
              <InstrumentCard key={instrument.id} instrument={instrument} owned={true} />
            ))}
          </div>
      </div>
      }
      <h1>Available Instruments</h1>
      <div className="instrument-list">
        {instruments.map(instrument => (
          <InstrumentCard key={instrument.id} instrument={instrument} owned={false}/>
        ))}
      </div>
    </div>
  );
}

export default Homepage;