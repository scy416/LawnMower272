from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from app.social.recoAlgo import compute_daily_recommendations

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(compute_daily_recommendations, 'interval', hours=24)
    
    scheduler.start()
    print("algo start")
    
    yield

    scheduler.shutdown()
    print("algo stop")