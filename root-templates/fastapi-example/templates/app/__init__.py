import uvicorn


def main(dev: bool = True):
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=dev)
