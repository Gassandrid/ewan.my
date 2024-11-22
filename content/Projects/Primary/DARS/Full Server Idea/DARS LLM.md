---
tags:
  - dars
---
Two main parts to the LLM structure behind DARS.

## Frontend

A silly way to put it, but the frontend is responsible for the personality and appearance of DARS to the user through audio reactions ( and also possibly a [[AI Command API]] ), which could then decide if the backend needs to be called to hand the system functionality of DARS.

Uses Ollama 3.1 8B

Speech recognition is handled by Vosk
## Backend

Includes a variety of API's to give DARS all the resources it needs for web related activity. But more importantly, this will give us access to the very high parameter language models that are hosted elsewhere, as unfortunately the frontend LLM is limited to 8B parameters due to Raspberry Pi restrictions.

Uses:

- OpenAI / Claude / etc. API
- Eleven Labs for voice synthesis
- various information-gathering API's
