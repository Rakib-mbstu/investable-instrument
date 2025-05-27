import React from 'react';

const isPdf = (url) => url.toLowerCase().endsWith('.pdf');

const ReceiptViewer = ({ receiptUrl }) => {
  if (!receiptUrl) return <div>No file to display.</div>;

  if (isPdf(receiptUrl)) {
    // Render PDF in iframe
    return (
      <iframe
        src={receiptUrl}
        width="100%"
        height="600px"
        title="Receipt PDFdata.isAdmin"
        style={{ border: 'none' }}
      />
    );
  } else {
    // Render image
    return (
      <img
        src={receiptUrl}
        alt="Receipt"
        style={{ maxWidth: '100%', maxHeight: '600px' }}
      />
    );
  }
};

export default ReceiptViewer;