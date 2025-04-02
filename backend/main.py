from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
import io
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CaptionCraft API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and processor
model = None
processor = None

def load_model():
    global model, processor
    try:
        logger.info("Loading BLIP model and processor...")
        processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        logger.info("Model and processor loaded successfully!")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

@app.on_event("startup")
async def startup_event():
    load_model()

def generate_caption(image: Image.Image) -> str:
    try:
        if model is None or processor is None:
            load_model()
            
        inputs = processor(image, return_tensors="pt")
        output = model.generate(**inputs)
        caption = processor.decode(output[0], skip_special_tokens=True)
        return caption
    except Exception as e:
        logger.error(f"Error generating caption: {str(e)}")
        raise

@app.get("/")
async def root():
    return {"message": "Welcome to CaptionCraft API", "status": "running"}

@app.post("/generate-caption/")
async def generate_caption_api(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (max 10MB)
        file_size = 0
        file.file.seek(0, 2)  # Seek to end of file
        file_size = file.file.tell()  # Get current position
        file.file.seek(0)  # Reset to beginning
        if file_size > 10 * 1024 * 1024:  # 10MB in bytes
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Generate caption
        caption = generate_caption(image)
        
        return JSONResponse(content={
            "caption": caption,
            "filename": file.filename,
            "status": "success"
        })
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return JSONResponse(
            content={"error": "Failed to process image", "details": str(e)},
            status_code=500
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None and processor is not None
    } 