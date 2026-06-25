import os

from openai import OpenAI


def build_ai_prompt(position_analysis, market_analysis, timeseries_analysis):
    return f"""
You are analyzing an Old School RuneScape Grand Exchange item position.

Use only the data provided.
Do not guarantee profit.
Do not tell the user what they must do.
Keep the response concise, practical, and easy to understand.

Position data:
- Item: {position_analysis.get("item_name")}
- Quantity: {position_analysis.get("quantity")}
- Buy price per item: {position_analysis.get("buy_price")} gp
- Current sell price per item: {position_analysis.get("raw_sell_price")} gp
- Estimated GE tax per item: {position_analysis.get("estimated_ge_tax_per_item")} gp
- Estimated profit/loss after tax: {position_analysis.get("estimated_profit_after_tax")} gp

Short-term market data:
- Current price: {market_analysis.get("current_price")} gp
- One-hour price change: {market_analysis.get("one_hour_price_change")} gp
- One-hour percent change: {market_analysis.get("one_hour_percent_change")}%
- Daily price change: {market_analysis.get("daily_price_change")} gp
- Daily percent change: {market_analysis.get("daily_percent_change")}%

Long-term trend data:
- Trend direction: {timeseries_analysis.get("trend_direction")}
- Long-term price change: {timeseries_analysis.get("price_change")} gp
- Long-term percent change: {timeseries_analysis.get("percent_change")}%
- Support price: {timeseries_analysis.get("support_price")} gp
- Resistance price: {timeseries_analysis.get("resistance_price")} gp
- Volatility percent: {timeseries_analysis.get("volatility_percent")}%

Write the response in this exact format:

Summary:
<2-3 sentence plain-English summary of the position and current market situation>

Considerations:
- Cautious sell case: <explain what would support selling now, while being clear it is the user's choice>
- Hold/watch case: <explain what would support waiting, especially if short-term and long-term signals differ>
- Risk note: <explain the main risk, including GE tax, volatility, or trend direction>

Takeaway:
<one balanced closing thought that helps the user compare the tradeoffs without giving a guaranteed recommendation>
"""


def generate_ai_position_analysis(
    position_analysis,
    market_analysis,
    timeseries_analysis,
):
    api_key = os.environ.get("OPENAI_API_KEY")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=api_key)

    prompt = build_ai_prompt(
        position_analysis,
        market_analysis,
        timeseries_analysis,
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You write concise, practical OSRS Grand Exchange market analysis.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_tokens=350,
        temperature=0.4,
    )

    return response.choices[0].message.content