import React, { useState } from 'react';
import PdfViewer from '../PdfViewer/PdfViewer';
import { references } from '../../references';
import Button from '../Button/Button'; 
import css from './HomePage.module.css'

const HomePage = () => {
  const [highlightedReference, setHighlightedReference] = useState('');

    return(
        <div className={css.allDiv}>
      <h1 className={css.titlePage}>PDF Viewer</h1>
      <div className={css.buttons}>
        {references.map((ref, index) => (
          <Button 
            key={index} 
            text={ref}
            setHighlightedReference={setHighlightedReference}
            // onClick={() => setHighlightedReference(ref)}
          />
        ))}
      </div>
      <PdfViewer pdfUrl="wa-cigna-dental-preventive-policy.pdf" searchText={highlightedReference} />
    </div>
    )
}

export default HomePage