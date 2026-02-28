import React, { useState, useEffect } from 'react';
import { useQR } from './hooks/useQR';
import { useTranslations } from './hooks/useTranslations';
import { generateId } from './utils/accessibility';
import {
  Link as LinkIcon,
  Wifi,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  Download,
  Star,
  Type,
  ChevronDown,
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TabType = ['url', 'wifi', 'phone', 'email', 'location', 'vcard'];

export default function App() {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState('url');
  const [formData, setFormData] = useState({
    url: '',
    wifiSsid: '',
    wifiPass: '',
    wifiEnc: 'WPA',
    phone: '',
    emailRecipient: '',
    emailSubject: '',
    emailBody: '',
    lat: '',
    lng: '',
    locationName: '',
    vcardFirstName: '',
    vcardLastName: '',
    vcardOrganization: '',
    vcardPhone: '',
    vcardEmail: '',
    vcardWebsite: '',
  });
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [logoUrl, setLogoUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate unique IDs for accessibility
  const tabPanelId = generateId('tab-panel');
  const logoDescId = generateId('logo-desc');
  const autoUpdateId = generateId('auto-update');
  const fgColorDescId = generateId('fg-color-desc');
  const bgColorDescId = generateId('bg-color-desc');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isAllInputsEmpty = () => {
    return !formData.url.trim() &&
           !formData.wifiSsid.trim() && !formData.wifiPass.trim() &&
           !formData.phone.trim() &&
           !formData.emailRecipient.trim() && !formData.emailSubject.trim() && !formData.emailBody.trim() &&
           !formData.lat.trim() && !formData.lng.trim() && !formData.locationName.trim() &&
           !formData.vcardFirstName.trim() && !formData.vcardLastName.trim() &&
           !formData.vcardOrganization.trim() && !formData.vcardPhone.trim() &&
           !formData.vcardEmail.trim() && !formData.vcardWebsite.trim();
  };

  const getQRValue = () => {
    // Check if all relevant inputs for the active tab are empty
    const isTabEmpty = () => {
      switch (activeTab) {
        case 'url':
          return !formData.url.trim();
        case 'wifi':
          return !formData.wifiSsid.trim() && !formData.wifiPass.trim();
        case 'phone':
          return !formData.phone.trim();
        case 'email':
          return !formData.emailRecipient.trim() && !formData.emailSubject.trim() && !formData.emailBody.trim();
        case 'location':
          return !formData.lat.trim() && !formData.lng.trim() && !formData.locationName.trim();
        case 'vcard':
          return !formData.vcardFirstName.trim() && !formData.vcardLastName.trim() &&
                 !formData.vcardOrganization.trim() && !formData.vcardPhone.trim() &&
                 !formData.vcardEmail.trim() && !formData.vcardWebsite.trim();
        default:
          return true;
      }
    };

    const isTabDataEmpty = isTabEmpty();

    // Return default QR if tab is empty
    if (isTabDataEmpty) {
      return 'https://kace.dev';
    }

    switch (activeTab) {
      case 'url':
        return formData.url || 'https://example.com';
      case 'wifi':
        return `WIFI:S:${formData.wifiSsid};T:${formData.wifiEnc};P:${formData.wifiPass};;`;
      case 'phone':
        return `tel:${formData.phone}`;
      case 'email':
        const emailParams = new URLSearchParams();
        emailParams.set('subject', formData.emailSubject);
        if (formData.emailBody) {
          emailParams.set('body', formData.emailBody);
        }
        return `mailto:${formData.emailRecipient}?${emailParams.toString()}`;
      case 'location':
        const coords = `${formData.lat},${formData.lng}`;
        const query = formData.locationName ? `${coords}(${encodeURIComponent(formData.locationName)})` : coords;
        return `https://maps.google.com/?q=${query}`;
      case 'vcard':
        const vcardLines = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${formData.vcardLastName || ''};${formData.vcardFirstName || ''};;;`,
          `FN:${formData.vcardFirstName || ''} ${formData.vcardLastName || ''}`.trim(),
          formData.vcardOrganization ? `ORG:${formData.vcardOrganization}` : '',
          formData.vcardPhone ? `TEL;TYPE=CELL:${formData.vcardPhone}` : '',
          formData.vcardEmail ? `EMAIL:${formData.vcardEmail}` : '',
          formData.vcardWebsite ? `URL:${formData.vcardWebsite}` : '',
          'END:VCARD'
        ].filter(line => line && !line.startsWith('ORG:') && !line.startsWith('TEL;') && !line.startsWith('EMAIL:') && !line.startsWith('URL:') ||
           (line.startsWith('ORG:') && formData.vcardOrganization) ||
           (line.startsWith('TEL;') && formData.vcardPhone) ||
           (line.startsWith('EMAIL:') && formData.vcardEmail) ||
           (line.startsWith('URL:') && formData.vcardWebsite));
        return vcardLines.join('\n');
      default:
        return '';
    }
  };

  const qrOptions = {
    light: (() => {
      const isTabEmpty = () => {
        switch (activeTab) {
          case 'url':
            return !formData.url.trim();
          case 'wifi':
            return !formData.wifiSsid.trim() && !formData.wifiPass.trim();
          case 'phone':
            return !formData.phone.trim();
          case 'email':
            return !formData.emailRecipient.trim() && !formData.emailSubject.trim() && !formData.emailBody.trim();
          case 'location':
            return !formData.lat.trim() && !formData.lng.trim() && !formData.locationName.trim();
          case 'vcard':
            return !formData.vcardFirstName.trim() && !formData.vcardLastName.trim() &&
                   !formData.vcardOrganization.trim() && !formData.vcardPhone.trim() &&
                   !formData.vcardEmail.trim() && !formData.vcardWebsite.trim();
          default:
            return true;
        }
      };
      return isTabEmpty() ? '#1e1e1f' : bgColor;
    })(),
    dark: (() => {
      const isTabEmpty = () => {
        switch (activeTab) {
          case 'url':
            return !formData.url.trim();
          case 'wifi':
            return !formData.wifiSsid.trim() && !formData.wifiPass.trim();
          case 'phone':
            return !formData.phone.trim();
          case 'email':
            return !formData.emailRecipient.trim() && !formData.emailSubject.trim() && !formData.emailBody.trim();
          case 'location':
            return !formData.lat.trim() && !formData.lng.trim() && !formData.locationName.trim();
          case 'vcard':
            return !formData.vcardFirstName.trim() && !formData.vcardLastName.trim() &&
                   !formData.vcardOrganization.trim() && !formData.vcardPhone.trim() &&
                   !formData.vcardEmail.trim() && !formData.vcardWebsite.trim();
          default:
            return true;
        }
      };
      return isTabEmpty() ? '#fb945b' : fgColor;
    })(),
    margin: 2,
    size: 1000,
    centerImageUrl: isAllInputsEmpty() ? 'https://kace.dev/images/at.png' : (logoUrl || null)
  };

  const { qrUrl, downloadQR: downloadQRCode } = useQR(getQRValue(), qrOptions);

  const isInputsEmpty = () => {
    switch (activeTab) {
      case 'url':
        return !formData.url.trim();
      case 'wifi':
        return !formData.wifiSsid.trim() && !formData.wifiPass.trim();
      case 'phone':
        return !formData.phone.trim();
      case 'email':
        return !formData.emailRecipient.trim() && !formData.emailSubject.trim() && !formData.emailBody.trim();
      case 'location':
        return !formData.lat.trim() && !formData.lng.trim() && !formData.locationName.trim();
      case 'vcard':
        return !formData.vcardFirstName.trim() && !formData.vcardLastName.trim() &&
               !formData.vcardOrganization.trim() && !formData.vcardPhone.trim() &&
               !formData.vcardEmail.trim() && !formData.vcardWebsite.trim();
      default:
        return true;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadQRCode();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };


  const tabs = [
    { id: 'url', label: 'Text/URL', icon: LinkIcon },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'vcard', label: 'vCard', icon: User },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-white/5">
          {/* Tabs Navigation */}
          <nav className="flex border-b border-white/10 px-6 overflow-x-auto whitespace-nowrap scrollbar-hide" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-label={t(`tabs.${tab.id}`)}
                aria-controls={tabPanelId}
                className={`px-4 py-5 text-sm font-medium transition-colors flex items-center gap-2 relative bg-card cursor-pointer focus:outline-none focus:ring-0 ${
                  activeTab === tab.id ? 'text-brand' : 'text-gray-400 hover:text-brand'
                } focus-visible:after:absolute focus-visible:after:bottom-0 focus-visible:after:left-0 focus-visible:after:right-0 focus-visible:after:h-0.5 focus-visible:after:bg-gray-500 focus-visible:after:z-10`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand z-20"
                  />
                )}
              </button>
            ))}
          </nav>
          <div className="flex flex-col md:flex-row">
            {/* Input Area */}
            <section className="flex-1 p-8 border-r border-white/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  role="tabpanel"
                  id={tabPanelId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Content or URL</label>
                      <textarea
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        aria-label={t('inputs.url')}
                        className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all placeholder-gray-600"
                        placeholder="Enter text or paste a link..."
                        rows={2}
                      />
                    </div>
                  )}

                  {activeTab === 'wifi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Network Name (SSID)</label>
                        <input
                          type="text"
                          name="wifiSsid"
                          value={formData.wifiSsid}
                          onChange={handleInputChange}
                          aria-label={t('inputs.wifiSsid')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="e.g. MyHomeNetwork"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Password</label>
                        <input
                          type="password"
                          name="wifiPass"
                          value={formData.wifiPass}
                          onChange={handleInputChange}
                          aria-label={t('inputs.wifiPass')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Encryption</label>
                        <div className="relative">
                          <select
                            name="wifiEnc"
                            value={formData.wifiEnc}
                            onChange={handleInputChange}
                            aria-label={t('inputs.wifiEnc')}
                            aria-expanded="false"
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all appearance-none pr-10"
                          >
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'phone' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        aria-label={t('inputs.phone')}
                        className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  )}

                  {activeTab === 'email' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Recipient Email</label>
                        <input
                          type="email"
                          name="emailRecipient"
                          value={formData.emailRecipient}
                          onChange={handleInputChange}
                          aria-label={t('inputs.emailRecipient')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="hello@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Subject (Optional)</label>
                        <input
                          type="text"
                          name="emailSubject"
                          value={formData.emailSubject}
                          onChange={handleInputChange}
                          aria-label={t('inputs.emailSubject')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="Contacting via QR"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Body (Optional)</label>
                        <textarea
                          name="emailBody"
                          value={formData.emailBody}
                          onChange={handleInputChange}
                          aria-label={t('inputs.emailBody')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all placeholder-gray-600"
                          placeholder="Enter email message content..."
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Latitude</label>
                          <input
                            type="text"
                            name="lat"
                            value={formData.lat}
                            onChange={handleInputChange}
                            aria-label={t('inputs.lat')}
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                            placeholder="0.0000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Longitude</label>
                          <input
                            type="text"
                            name="lng"
                            value={formData.lng}
                            onChange={handleInputChange}
                            aria-label={t('inputs.lng')}
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                            placeholder="0.0000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Location Name (Optional)</label>
                        <input
                          type="text"
                          name="locationName"
                          value={formData.locationName}
                          onChange={handleInputChange}
                          aria-label={t('inputs.locationName')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="Olongapo City, Philippines"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'vcard' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                          <input
                            type="text"
                            name="vcardFirstName"
                            value={formData.vcardFirstName}
                            onChange={handleInputChange}
                            aria-label={t('inputs.vcardFirstName')}
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="vcardLastName"
                            value={formData.vcardLastName}
                            onChange={handleInputChange}
                            aria-label={t('inputs.vcardLastName')}
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Organization (Optional)</label>
                        <input
                          type="text"
                          name="vcardOrganization"
                          value={formData.vcardOrganization}
                          onChange={handleInputChange}
                          aria-label={t('inputs.vcardOrganization')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="Company Inc."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          name="vcardPhone"
                          value={formData.vcardPhone}
                          onChange={handleInputChange}
                          aria-label={t('inputs.vcardPhone')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="+1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          name="vcardEmail"
                          value={formData.vcardEmail}
                          onChange={handleInputChange}
                          aria-label={t('inputs.vcardEmail')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Website (Optional)</label>
                        <input
                          type="url"
                          name="vcardWebsite"
                          value={formData.vcardWebsite}
                          onChange={handleInputChange}
                          aria-label={t('inputs.vcardWebsite')}
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Logo URL (Optional)</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    aria-label={t('inputs.logoUrl')}
                    aria-describedby={logoDescId}
                    className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:ring-brand focus:border-brand outline-none transition-all placeholder-gray-600 pl-11"
                    placeholder="https://example.com/logo.png"
                  />
                  <ImageIcon size={18} className="absolute left-4 text-gray-500" />
                </div>
                <p id={logoDescId} className="text-[10px] text-gray-600 mt-2">{t('descriptions.logoRecommendation')}</p>
              </div>

              <div className="mt-8">
                <p id={autoUpdateId} className="text-xs text-gray-400">{t('descriptions.autoUpdate')}</p>
              </div>
            </section>

            {/* Preview Area */}
            <section className="w-full md:w-[320px] p-8 flex flex-col items-center justify-between bg-black/10">
              <div className="w-full flex flex-col items-center">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6 w-full text-center">Preview</span>

                <div className="mb-6">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-[200px] h-[200px] rounded-2xl"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-500">Enter content to generate QR</span>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-4 mb-8">
                  <div className="flex flex-col space-y-2" role="group" aria-labelledby={fgColorDescId}>
                    <label id={fgColorDescId} className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Foreground</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex items-center bg-dark border border-white/10 rounded-lg p-1.5 flex-1">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          aria-label={t('colors.foreground')}
                          className="w-6 h-6 border-none bg-transparent cursor-pointer rounded overflow-hidden p-0"
                        />
                        <input
                          type="text"
                          value={fgColor}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow # followed by 6 hex characters
                            if (value === '' || value === '#' || (value.startsWith('#') && /^[0-9A-Fa-f]{0,6}$/.test(value.slice(1)))) {
                              setFgColor(value);
                            }
                          }}
                          aria-label={t('colors.foregroundHex')}
                          placeholder="#000000"
                          className="ml-2 bg-transparent border-none outline-none text-[12px] font-mono text-gray-400 uppercase w-20"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2" role="group" aria-labelledby={bgColorDescId}>
                    <label id={bgColorDescId} className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Background</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex items-center bg-dark border border-white/10 rounded-lg p-1.5 flex-1">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          aria-label={t('colors.background')}
                          className="w-6 h-6 border-none bg-transparent cursor-pointer rounded overflow-hidden p-0"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow # followed by 6 hex characters
                            if (value === '' || value === '#' || (value.startsWith('#') && /^[0-9A-Fa-f]{0,6}$/.test(value.slice(1)))) {
                              setBgColor(value);
                            }
                          }}
                          aria-label={t('colors.backgroundHex')}
                          placeholder="#FFFFFF"
                          className="ml-2 bg-transparent border-none outline-none text-[12px] font-mono text-gray-400 uppercase w-20"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading || isInputsEmpty()}
                aria-label={isDownloading ? t('buttons.downloading') : isInputsEmpty() ? t('buttons.enterContent') : t('buttons.download')}
                aria-busy={isDownloading}
                className="w-full hover:bg-opacity-90 text-black bg-brand! cursor-pointer font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isDownloading || isInputsEmpty()) ? (
                  <>
                    {isDownloading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Download size={20} className="transition-transform group-hover:translate-y-0.5" />}
                    {isDownloading ? 'Downloading...' : 'Enter Content First'}
                  </>
                ) : (
                  <>
                    <Download size={20} className="transition-transform group-hover:translate-y-0.5" />
                    Download QR Code
                  </>
                )}
              </button>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Secure & Private QR Generation</p>
          <p className="text-gray-600 text-xs">
            Developed by <a href="https://github.com/userkace" className="text-offwhite hover:text-brand hover:underline transition-all">Kace</a>
            <span className="mx-2">•</span>
            <a href="https://github.com/userkace/qr" className="text-brand hover:underline transition-all">Github Repository</a>
          </p>
        </footer>
      </motion.main>
    </div>
  );
}