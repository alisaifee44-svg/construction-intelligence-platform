"""
AI Service Module — Google Gemini Integration.
Provides multimodal AI analysis for construction intelligence features.
Handles image + text prompts and enforces strict JSON response parsing.
"""

import json
import re
import google.generativeai as genai
from PIL import Image
import io
from config import settings


# Configure the Gemini API
if settings.is_configured:
    genai.configure(api_key=settings.GEMINI_API_KEY)


def get_model():
    """Get the configured Gemini model instance."""
    return genai.GenerativeModel(
        model_name=settings.MODEL_NAME,
        generation_config={
            "temperature": 0.4,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
        }
    )


def process_image(image_bytes: bytes) -> Image.Image:
    """Process uploaded image bytes into a PIL Image."""
    return Image.open(io.BytesIO(image_bytes))


def extract_json_from_response(text: str) -> dict:
    """
    Extract JSON from AI response text.
    Handles cases where the model wraps JSON in markdown code blocks.
    """
    # Try to find JSON in code blocks first
    json_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if json_match:
        text = json_match.group(1).strip()

    # Try direct JSON parsing
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find any JSON object in the text
        brace_match = re.search(r'\{.*\}', text, re.DOTALL)
        if brace_match:
            try:
                return json.loads(brace_match.group())
            except json.JSONDecodeError:
                pass

    # Return error structure if parsing fails
    return {"error": "Failed to parse AI response", "raw_response": text[:500]}


async def analyze_safety(image_bytes: bytes, additional_context: str = "") -> dict:
    """
    Analyze a construction site image for safety hazards.

    Args:
        image_bytes: Raw bytes of the construction site image
        additional_context: Optional additional context about the site

    Returns:
        Structured safety analysis as a dictionary
    """
    model = get_model()
    image = process_image(image_bytes)

    prompt = f"""You are an expert construction site safety analyst. Analyze this construction site image 
for safety hazards, PPE compliance, and risk factors.

{f"Additional context: {additional_context}" if additional_context else ""}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "overall_safety_score": <integer 0-100, where 100 is safest>,
    "overall_risk_level": "<low|medium|high|critical>",
    "summary": "<executive summary of safety conditions>",
    "hazards": [
        {{
            "hazard_type": "<type of hazard>",
            "description": "<detailed description>",
            "severity": "<low|medium|high|critical>",
            "location_in_image": "<where in image>",
            "recommendation": "<corrective action>"
        }}
    ],
    "ppe_compliance": {{
        "hard_hats": "<compliant|non_compliant|not_visible>",
        "safety_vests": "<compliant|non_compliant|not_visible>",
        "safety_boots": "<compliant|non_compliant|not_visible>",
        "gloves": "<compliant|non_compliant|not_visible>",
        "eye_protection": "<compliant|non_compliant|not_visible>",
        "fall_protection": "<compliant|non_compliant|not_applicable>"
    }},
    "general_recommendations": ["<recommendation 1>", "<recommendation 2>"]
}}"""

    response = model.generate_content([prompt, image])
    return extract_json_from_response(response.text)


async def analyze_cracks(image_bytes: bytes, additional_context: str = "") -> dict:
    """
    Analyze structural cracks in a construction image.

    Args:
        image_bytes: Raw bytes of the crack image
        additional_context: Optional details about the structure

    Returns:
        Structured crack analysis as a dictionary
    """
    model = get_model()
    image = process_image(image_bytes)

    prompt = f"""You are an expert structural engineer specializing in crack analysis and diagnostics.
Analyze this image of structural cracks and provide a detailed assessment.

{f"Additional context: {additional_context}" if additional_context else ""}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "overall_condition": "<assessment of overall structural condition>",
    "urgency_level": "<low|medium|high|critical>",
    "cracks_detected": <number of cracks detected>,
    "cracks": [
        {{
            "crack_type": "<hairline|structural|shrinkage|settlement|alligator|diagonal|horizontal|vertical>",
            "severity": "<low|medium|high|critical>",
            "estimated_width": "<estimated width in mm>",
            "estimated_length": "<estimated length>",
            "location_in_image": "<where in the image>",
            "probable_cause": "<most likely cause>",
            "structural_impact": "<impact on structural integrity>"
        }}
    ],
    "recommended_actions": ["<action 1>", "<action 2>"],
    "estimated_repair_cost_range": "<cost range estimate>",
    "monitoring_advice": "<advice for ongoing monitoring>"
}}"""

    response = model.generate_content([prompt, image])
    return extract_json_from_response(response.text)


async def evaluate_property(property_details: dict) -> dict:
    """
    Evaluate real estate property value based on provided details.

    Args:
        property_details: Dictionary with property information

    Returns:
        Structured valuation response as a dictionary
    """
    model = get_model()

    prompt = f"""You are an expert real estate appraiser and market analyst. 
Based on the following property details, provide a comprehensive valuation estimate.

Property Details:
- Location: {property_details.get('location', 'Not specified')}
- Property Type: {property_details.get('property_type', 'Not specified')}
- Area (sq ft): {property_details.get('area_sqft', 'Not specified')}
- Number of Bedrooms: {property_details.get('bedrooms', 'Not specified')}
- Number of Bathrooms: {property_details.get('bathrooms', 'Not specified')}
- Year Built: {property_details.get('year_built', 'Not specified')}
- Condition: {property_details.get('condition', 'Not specified')}
- Amenities: {property_details.get('amenities', 'Not specified')}
- Additional Notes: {property_details.get('additional_notes', 'None')}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "estimated_value_min": <minimum value as number>,
    "estimated_value_max": <maximum value as number>,
    "estimated_value_mid": <midpoint value as number>,
    "currency": "USD",
    "confidence_level": "<low|moderate|high>",
    "valuation_summary": "<detailed summary of valuation>",
    "key_factors": [
        {{
            "factor": "<factor name>",
            "impact": "<positive|negative|neutral>",
            "details": "<details about this factor>"
        }}
    ],
    "market_trend": "<current market trend analysis>",
    "comparable_properties": ["<comparable property 1>", "<comparable property 2>"]
}}"""

    response = model.generate_content(prompt)
    return extract_json_from_response(response.text)


async def plan_project(project_details: dict) -> dict:
    """
    Generate a construction project plan with material estimates and scheduling.

    Args:
        project_details: Dictionary with project specifications

    Returns:
        Structured project plan as a dictionary
    """
    model = get_model()

    prompt = f"""You are an expert construction project planner and estimator.
Based on the following project details, create a comprehensive project plan with material estimates,
cost calculations, and task scheduling.

Project Details:
- Project Type: {project_details.get('project_type', 'Not specified')}
- Description: {project_details.get('description', 'Not specified')}
- Location: {project_details.get('location', 'Not specified')}
- Area (sq ft): {project_details.get('area_sqft', 'Not specified')}
- Number of Floors: {project_details.get('floors', 'Not specified')}
- Construction Type: {project_details.get('construction_type', 'Not specified')}
- Budget Range: {project_details.get('budget_range', 'Not specified')}
- Timeline Preference: {project_details.get('timeline', 'Not specified')}
- Special Requirements: {project_details.get('special_requirements', 'None')}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "project_summary": "<overview of the project plan>",
    "estimated_total_cost": "<total cost estimate>",
    "estimated_duration": "<total duration estimate>",
    "materials": [
        {{
            "material_name": "<material>",
            "quantity": "<quantity with unit>",
            "unit_cost": "<cost per unit>",
            "total_cost": "<total cost>",
            "notes": "<any notes>"
        }}
    ],
    "tasks": [
        {{
            "task_name": "<task>",
            "duration": "<duration>",
            "dependencies": ["<dependent tasks>"],
            "priority": "<high|medium|low>",
            "description": "<task description>"
        }}
    ],
    "risk_factors": ["<risk 1>", "<risk 2>"],
    "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}}"""

    response = model.generate_content(prompt)
    return extract_json_from_response(response.text)


async def get_daily_assistance(site_details: dict) -> dict:
    """
    Provide daily site assistance with weather-aware advisory.

    Args:
        site_details: Dictionary with site location and current activities

    Returns:
        Structured daily assistance response as a dictionary
    """
    model = get_model()

    prompt = f"""You are an expert construction site manager providing daily assistance and weather-aware advisory.
Based on the following site details, provide a comprehensive daily briefing.

Site Details:
- Location: {site_details.get('location', 'Not specified')}
- Current Weather/Season: {site_details.get('weather', 'Not specified')}
- Temperature: {site_details.get('temperature', 'Not specified')}
- Current Phase: {site_details.get('current_phase', 'Not specified')}
- Planned Activities Today: {site_details.get('planned_activities', 'Not specified')}
- Number of Workers: {site_details.get('worker_count', 'Not specified')}
- Special Concerns: {site_details.get('concerns', 'None')}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "greeting": "<professional daily greeting with overview>",
    "weather_summary": "<weather summary and forecast>",
    "weather_alerts": [
        {{
            "alert_type": "<type of alert>",
            "severity": "<low|medium|high|critical>",
            "description": "<alert description>",
            "recommended_action": "<what to do>"
        }}
    ],
    "daily_checklist": [
        {{
            "item": "<checklist item>",
            "category": "<safety|quality|logistics|documentation|equipment>",
            "priority": "<high|normal|low>"
        }}
    ],
    "activity_recommendations": ["<recommendation 1>", "<recommendation 2>"],
    "safety_reminders": ["<reminder 1>", "<reminder 2>"],
    "tip_of_the_day": "<useful construction tip>"
}}"""

    response = model.generate_content(prompt)
    return extract_json_from_response(response.text)


async def get_knowledge_response(question: str, context: str = "") -> dict:
    """
    Answer construction-related questions with expert knowledge.

    Args:
        question: The construction-related question
        context: Optional context for the question

    Returns:
        Structured knowledge response as a dictionary
    """
    model = get_model()

    prompt = f"""You are a comprehensive construction knowledge expert and advisor.
Provide a detailed, accurate, and practical answer to the following construction-related question.

Question: {question}
{f"Context: {context}" if context else ""}

Respond ONLY with valid JSON in this exact format (no other text):
{{
    "answer": "<comprehensive answer to the question>",
    "key_points": ["<key point 1>", "<key point 2>"],
    "technical_details": "<additional technical details if applicable>",
    "best_practices": ["<best practice 1>", "<best practice 2>"],
    "references": [
        {{
            "title": "<reference title>",
            "relevance": "<how this is relevant>"
        }}
    ],
    "related_topics": ["<related topic 1>", "<related topic 2>"]
}}"""

    response = model.generate_content(prompt)
    return extract_json_from_response(response.text)
