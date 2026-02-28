# Gen QR - Custom QR Codes Made Simple

A modern, intuitive QR code generator with custom colors, logos, and multiple QR types. Built with React and Vite for a fast, responsive experience.

## ✨ Features

- **Multiple QR Types**: Generate QR codes for URLs, WiFi networks, phone numbers, emails, locations, and vCards
- **Custom Colors**: Choose custom foreground and background colors with hex input support
- **Logo Support**: Add custom logos to your QR codes
- **Real-time Preview**: See your QR code update instantly as you type
- **High-Quality Downloads**: Download 1000x1000px PNG images
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Theme**: Modern dark interface with brand accents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/userkace/qr.git
cd qr

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 QR Types Supported

### 📝 Text/URL
- Plain text or website URLs
- Automatic URL detection

### 📶 WiFi
- Network name (SSID)
- Password
- Security type (WPA/WEP/None)

### 📞 Phone
- Phone numbers with automatic tel: link generation

### 📧 Email
- Recipient address
- Subject line
- Message body

### 📍 Location
- GPS coordinates
- Optional location name
- Google Maps integration

### 👤 vCard
- First and last name
- Organization
- Phone number
- Email address
- Website

## 🎨 Customization

### Colors
- **Foreground**: QR code pattern color
- **Background**: QR code background color
- **Hex Input**: Manual hex color entry supported
- **Live Preview**: Real-time color updates

### Logos
- **Supported Formats**: PNG, JPG, SVG
- **Recommended**: Square PNG with transparent background
- **Size**: Automatically optimized for QR clarity
- **Default**: Branded @ logo shown when all inputs are empty

## 🛠️ Tech Stack

- **Frontend**: React 18 with hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **QR Generation**: QuickChart API

## 📱 Responsive Features

- Mobile-optimized interface
- Touch-friendly controls
- Adaptive layouts
- Cross-browser compatibility

## 🧩 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom hooks
│   └── useQR.js        # QR generation logic
├── App.jsx             # Main application
├── index.css           # Global styles
└── main.jsx            # App entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Usage Tips

1. **Empty State**: When all inputs are empty, shows a branded QR code linking to https://kace.dev
2. **Color Contrast**: Ensure good contrast between foreground and background for scannability
3. **Logo Size**: Keep logos simple and high-contrast for best results
4. **QR Testing**: Always test generated QR codes before sharing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Made by

Created with ❤️ by [Kace](https://kace.dev)

---

**Gen QR** - Making custom QR codes simple and beautiful.
