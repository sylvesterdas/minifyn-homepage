import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ className = '' }) => {
  const [input, setInput] = useState('');
  const [qrData, setQrData] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let processedInput = input.trim();

    try {
      // Check if input is valid JSON
      JSON.parse(processedInput);
    } catch (e) {
      // If not JSON, treat as URL
      if (!processedInput.startsWith('http://') && !processedInput.startsWith('https://')) {
        processedInput = 'https://' + processedInput;
      }
    }

    setQrData(processedInput);
    setShowModal(true);
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a URL or JSON object for QR Code"
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-opacity-50 transition-colors"
          rows="5"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors"
        >
          Generate QR Code
        </button>
      </form>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <QRCodeSVG id="qr-code" value={qrData} size={200} bgColor="#ffffff" fgColor="#000000" level="L" includeMargin={false} />
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;