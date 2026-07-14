from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trips = relationship("SavedTrip", back_populates="user", cascade="all, delete-orphan")


class SavedTrip(Base):
    __tablename__ = "saved_trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(String, nullable=False)
    style = Column(String, nullable=False)
    interests = Column(String, nullable=False)
    itinerary_json = Column(Text, nullable=False)  # JSON serialized as text
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="trips")
