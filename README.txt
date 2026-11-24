NILA HOMEWARE PLUS — HTML/CSS/JS STORE

FILES
- index.html: page structure
- style.css: responsive styling and animations
- script.js: product selection, order summary, geolocation and WhatsApp message
- assets/: transparent PNG product mockup images (two views per product)

SETUP
1. Extract the ZIP.
2. Open script.js.
3. Replace WHATSAPP_NUMBER = "91XXXXXXXXXX" with your WhatsApp number, including country code and digits only.
   Example: 919876543210
4. Open index.html in a browser, or use VS Code Live Server.

IMPORTANT
- The included PNGs are sample product mockups. Replace them with your real product PNG photos while keeping the same filenames, or update the image paths in the products array in script.js.
- Location access requires browser permission and works on localhost or HTTPS. The page embeds a Google Map for the selected coordinates and includes an Open in Google Maps link.
- No Google Maps API key is needed for the current-location flow. This version uses browser geolocation; it does not provide a draggable in-page Google Maps pin.
- Update product names, prices and descriptions in the products array in script.js.

LATEST UI CHANGES
- Light green / fresh home-care colour palette.
- Mobile order: product catalogue first, checkout underneath.
- Selected product cards are highlighted in green.
- Checkout summary shows product thumbnails and +/- quantity controls.
- Name and address are required. Current location is required before sending.
- Contact number is optional and is included in the WhatsApp message if entered.
- Added Nila logo PNG, browser favicon PNG and favicon ICO.
