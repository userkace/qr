import { useState, useMemo } from 'react';

export const useQR = (text, options = {}) => {
  const {
    light = '#FFFFFF',
    dark = '#000000',
    margin = 2,
    size = 1000,
    centerImageUrl = null
  } = options;

  const qrUrl = useMemo(() => {
    if (!text) return null;
    
    const params = new URLSearchParams({
      text: text,
      light: light.replace('#', ''),
      dark: dark.replace('#', ''),
      margin: margin.toString(),
      size: size.toString()
    });

    if (centerImageUrl) {
      console.log('Original centerImageUrl:', centerImageUrl);
      params.append('centerImageUrl', centerImageUrl);
    }

    const finalUrl = `https://quickchart.io/qr?${params.toString()}`;
    console.log('Final QR URL:', finalUrl);
    return finalUrl;
  }, [text, light, dark, margin, size, centerImageUrl]);

  const downloadQR = async () => {
    if (!qrUrl) return;
    
    try {
      // Fetch the image as a blob using the original qrUrl with user-selected colors
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = blobUrl;
      link.click();
      
      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      // Fallback to direct link if fetch fails
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrUrl;
      link.click();
    }
  };

  return {
    qrUrl,
    downloadQR
  };
};
