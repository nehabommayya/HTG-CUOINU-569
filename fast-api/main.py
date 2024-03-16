from fastapi import FastAPI, HTTPException, UploadFile, File
import os

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import OpenAI, ChatOpenAI
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

fine_tuned_model = ChatOpenAI(
    temperature=0, model_name="ft:gpt-4-1106-preview13:langchain::7qTVM5AR"
)


@app.post("/process-document/")
async def process_document(file: UploadFile = File(...)):
    try:
        # Temporary save file to disk
        with open("temp.pdf", "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
            print("File saved")

        # Extract text from the PDF
        doc = fitz.open()
        if not doc:
            print("doc not opened")
        text = ""
        for page in doc:
            text += page.get_text()

        print(text)

        doc.close()

        first_prompt = "The following is a medical letter sent to a patient with low medical literacy. Your job is to " \
                       "extract any medical language or jargon that would not be understood with someone with low " \
                       "medical literacy, as well as the medical context and any advice/explanations given in the " \
                       "letter. present your results in json format."

        prompt = "The following is a medical letter. Your job is to identify any medical jargon or terms that " \
                 "someone with a low medical literacy may not understand and present the letter in a way  " \
                 "they will be able to easily comprehend. explain any complex medical terminology or concepts" \
                 " in laymen terms. assume no previous medical knowledge and do not use any medical terminology " \
                 "in the response. the response should be addressed to the patient, explaining to them their" \
                 " medical problems:\n" + text

        response = llm.generate([prompt])



        print("sent to LLM")

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.remove("temp.pdf")
        print("Temporary file deleted")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
