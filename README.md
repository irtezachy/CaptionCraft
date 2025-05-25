# CaptionCraft - AI-Powered Image Captioning System

CaptionCraft is a full-stack AI-powered image captioning system that allows users to upload images and receive automatically generated captions. The system uses BLIP-2 for image processing and caption generation, with a FastAPI backend and React.js frontend.

## Features

- Image upload via drag-and-drop or click
- Automatic caption generation using BLIP-2
- Real-time processing and display
- Modern, responsive UI
- Error handling and loading states

## Project Structure

```
CaptionCraft/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
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

1. Open your browser and navigate to `http://localhost:3000`
2. Upload an image by dragging and dropping or clicking the upload area
3. Click "Generate Caption" to process the image
4. View the generated caption below the upload area

## Technologies Used

- Backend:
  - FastAPI
  - PyTorch
  - BLIP-2
  - PIL (Python Imaging Library)

- Frontend:
  - React.js
  - Axios
  - React Dropzone
  - CSS3

## License

MIT License 