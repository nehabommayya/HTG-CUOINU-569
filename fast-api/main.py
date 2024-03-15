from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import os
from langchain_openai import OpenAI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import fitz
from dotenv import load_dotenv

load_dotenv()


app = FastAPI(title="LangChain Document Processing Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set")

llm = OpenAI(openai_api_key=OPENAI_API_KEY)


@app.post("/process-document/")
async def process_document(file: UploadFile = File(...)):
    try:
        # Temporary save file to disk
        with open("temp.pdf", "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)

        # Extract text from the PDF
        doc = fitz.open("temp.pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        doc.close()

        prompt = "The following is a medical letter. Your job is to identify any medical jargon or terms that " \
                 "someone with a low medical literacy may not understand and present the letter in a way  " \
                 "they will be able to easily comprehend. explain any complex medical terminology or concepts" \
                 " in laymen terms. assume no previous medical knowledge and do not use any medical terminology " \
                 "in the response. the response should be addressed to the patient, explaining to them their" \
                 " medical problems:\n" + text
        response = llm.generate([prompt])

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

