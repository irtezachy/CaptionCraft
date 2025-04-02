# CaptionCraft

CaptionCraft is an AI-powered image captioning application that automatically generates descriptive captions for images using the BLIP (Bootstrapping Language-Image Pre-training) model from Salesforce. The application features a modern, user-friendly interface with real-time image processing capabilities.

## Features

### Frontend (React.js)
- Modern, responsive design using Material-UI
- Drag-and-drop interface for image uploads
- Real-time image preview
- Smooth animations and transitions
- Mobile-responsive design
- Error handling and user feedback

### Backend (FastAPI)
- High-performance API endpoints
- BLIP model integration for AI caption generation
- Image processing capabilities
- Health check endpoints
- Error handling and recovery

### Key Features
1. **Image Upload**
   - Drag-and-drop interface
   - Click to select files
   - Supports multiple image formats (JPG, PNG, GIF)
   - File size validation (max 10MB)
   - Real-time image preview

2. **Caption Generation**
   - AI-powered image analysis
   - Natural language caption generation
   - Real-time processing
   - Error handling and user feedback

3. **User Interface**
   - Clean, modern design with gradient accents
   - Loading indicators during processing
   - Error messages and notifications
   - Responsive layout for all devices
   - Smooth animations for better UX

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm 6+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. Open your web browser and navigate to `http://localhost:3000`
2. Drag and drop an image or click to select one
3. Wait for the image to upload and preview
4. Click "Generate Caption"
5. View the AI-generated caption in the animated card below

## Technical Details

### API Endpoints
- `GET /health`: Check API health status
- `POST /generate-caption/`: Generate caption for uploaded image

### Dependencies
- Backend:
  - FastAPI
  - PyTorch
  - Transformers
  - Pillow
  - python-multipart

- Frontend:
  - React
  - Material-UI
  - Axios
  - react-dropzone

## Future Enhancements
1. Support for multiple languages
2. Batch image processing
3. Caption editing capabilities
4. Social media sharing
5. User accounts and history
6. Custom caption styles
7. Advanced image analysis options

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 