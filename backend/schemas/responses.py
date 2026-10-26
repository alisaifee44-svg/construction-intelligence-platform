"""
Pydantic response schemas for strict JSON contracts.
Ensures frontend stability and predictable AI output parsing.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


# ─── Safety Monitoring Schemas ───────────────────────────────────────────────

class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Hazard(BaseModel):
    """Individual hazard detected in a construction site image."""
    hazard_type: str = Field(..., description="Type of hazard detected")
    description: str = Field(..., description="Detailed description of the hazard")
    severity: SeverityLevel = Field(..., description="Severity level")
    location_in_image: str = Field(..., description="Where in the image the hazard is located")
    recommendation: str = Field(..., description="Recommended corrective action")


class SafetyAnalysisResponse(BaseModel):
    """Complete safety analysis response for a construction site image."""
    overall_safety_score: int = Field(..., ge=0, le=100, description="Overall safety score 0-100")
    overall_risk_level: SeverityLevel = Field(..., description="Overall risk level")
    summary: str = Field(..., description="Executive summary of safety conditions")
    hazards: List[Hazard] = Field(default_factory=list, description="List of detected hazards")
    ppe_compliance: dict = Field(default_factory=dict, description="PPE compliance status")
    general_recommendations: List[str] = Field(default_factory=list, description="General safety recommendations")


# ─── Crack Detection Schemas ─────────────────────────────────────────────────

class CrackInfo(BaseModel):
    """Information about a detected crack."""
    crack_type: str = Field(..., description="Type of crack (e.g., hairline, structural, alligator)")
    severity: SeverityLevel = Field(..., description="Severity of the crack")
    estimated_width: str = Field(..., description="Estimated width of the crack")
    estimated_length: str = Field(..., description="Estimated length of the crack")
    location_in_image: str = Field(..., description="Location in the image")
    probable_cause: str = Field(..., description="Most probable cause")
    structural_impact: str = Field(..., description="Impact on structural integrity")


class CrackAnalysisResponse(BaseModel):
    """Complete crack analysis response."""
    overall_condition: str = Field(..., description="Overall structural condition assessment")
    urgency_level: SeverityLevel = Field(..., description="Urgency of repair needed")
    cracks_detected: int = Field(..., ge=0, description="Number of cracks detected")
    cracks: List[CrackInfo] = Field(default_factory=list, description="List of detected cracks")
    recommended_actions: List[str] = Field(default_factory=list, description="Recommended repair actions")
    estimated_repair_cost_range: str = Field(default="N/A", description="Estimated cost range for repairs")
    monitoring_advice: str = Field(default="", description="Ongoing monitoring advice")


# ─── Real Estate Valuation Schemas ───────────────────────────────────────────

class ValuationFactor(BaseModel):
    """A factor affecting property valuation."""
    factor: str = Field(..., description="Name of the factor")
    impact: str = Field(..., description="Positive, negative, or neutral impact")
    details: str = Field(..., description="Details about this factor")


class RealEstateValuationResponse(BaseModel):
    """Complete real estate valuation response."""
    estimated_value_min: float = Field(..., description="Minimum estimated value")
    estimated_value_max: float = Field(..., description="Maximum estimated value")
    estimated_value_mid: float = Field(..., description="Mid-point estimated value")
    currency: str = Field(default="USD", description="Currency of valuation")
    confidence_level: str = Field(..., description="Confidence in the estimate")
    valuation_summary: str = Field(..., description="Summary of the valuation")
    key_factors: List[ValuationFactor] = Field(default_factory=list, description="Key valuation factors")
    market_trend: str = Field(default="", description="Current market trend analysis")
    comparable_properties: List[str] = Field(default_factory=list, description="Comparable property descriptions")


# ─── Project Planning Schemas ────────────────────────────────────────────────

class Material(BaseModel):
    """Material estimation item."""
    material_name: str = Field(..., description="Name of the material")
    quantity: str = Field(..., description="Estimated quantity with unit")
    unit_cost: str = Field(..., description="Estimated unit cost")
    total_cost: str = Field(..., description="Estimated total cost")
    notes: str = Field(default="", description="Additional notes")


class Task(BaseModel):
    """Project task/milestone."""
    task_name: str = Field(..., description="Name of the task")
    duration: str = Field(..., description="Estimated duration")
    dependencies: List[str] = Field(default_factory=list, description="Dependent tasks")
    priority: str = Field(default="medium", description="Task priority")
    description: str = Field(default="", description="Task description")


class ProjectPlanningResponse(BaseModel):
    """Complete project planning response."""
    project_summary: str = Field(..., description="Overview of the project plan")
    estimated_total_cost: str = Field(..., description="Total estimated project cost")
    estimated_duration: str = Field(..., description="Total estimated project duration")
    materials: List[Material] = Field(default_factory=list, description="Material estimates")
    tasks: List[Task] = Field(default_factory=list, description="Project tasks/schedule")
    risk_factors: List[str] = Field(default_factory=list, description="Identified risk factors")
    recommendations: List[str] = Field(default_factory=list, description="Planning recommendations")


# ─── Daily Assistant Schemas ─────────────────────────────────────────────────

class WeatherAlert(BaseModel):
    """Weather-related alert."""
    alert_type: str = Field(..., description="Type of weather alert")
    severity: SeverityLevel = Field(..., description="Alert severity")
    description: str = Field(..., description="Alert description")
    recommended_action: str = Field(..., description="Recommended action")


class ChecklistItem(BaseModel):
    """Daily checklist item."""
    item: str = Field(..., description="Checklist item description")
    category: str = Field(..., description="Category (safety, quality, logistics, etc.)")
    priority: str = Field(default="normal", description="Priority level")


class DailyAssistantResponse(BaseModel):
    """Complete daily assistant response."""
    greeting: str = Field(..., description="Daily greeting/overview")
    weather_summary: str = Field(..., description="Weather summary for the location")
    weather_alerts: List[WeatherAlert] = Field(default_factory=list, description="Weather-related alerts")
    daily_checklist: List[ChecklistItem] = Field(default_factory=list, description="Daily checklist items")
    activity_recommendations: List[str] = Field(default_factory=list, description="Activity recommendations based on conditions")
    safety_reminders: List[str] = Field(default_factory=list, description="Daily safety reminders")
    tip_of_the_day: str = Field(default="", description="Construction tip of the day")


# ─── Knowledge Assistant Schemas ─────────────────────────────────────────────

class Reference(BaseModel):
    """Knowledge reference source."""
    title: str = Field(..., description="Reference title")
    relevance: str = Field(..., description="How this reference is relevant")


class KnowledgeResponse(BaseModel):
    """Complete knowledge assistant response."""
    answer: str = Field(..., description="Comprehensive answer to the question")
    key_points: List[str] = Field(default_factory=list, description="Key takeaway points")
    technical_details: str = Field(default="", description="Additional technical details")
    best_practices: List[str] = Field(default_factory=list, description="Related best practices")
    references: List[Reference] = Field(default_factory=list, description="References and sources")
    related_topics: List[str] = Field(default_factory=list, description="Related topics to explore")
