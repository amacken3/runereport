import pandas as pd


def get_midpoint_price(row):
    high_price = row.get("avgHighPrice")
    low_price = row.get("avgLowPrice")

    if pd.notna(high_price) and pd.notna(low_price):
        return round((high_price + low_price) / 2)

    if pd.notna(high_price):
        return high_price

    if pd.notna(low_price):
        return low_price

    return None


def get_total_volume(row):
    high_volume = row.get("highPriceVolume") or 0
    low_volume = row.get("lowPriceVolume") or 0

    return high_volume + low_volume


def get_trend_direction(percent_change):
    if percent_change is None:
        return "unknown"

    if percent_change > 1:
        return "up"

    if percent_change < -1:
        return "down"

    return "flat"


def get_timeframe_details(timestep):
    timeframe_details = {
        "1h": {
            "timeframe_label": "short_term",
            "estimated_range": "up to about 15 days"
        },
        "6h": {
            "timeframe_label": "medium_term",
            "estimated_range": "up to about 3 months"
        },
        "24h": {
            "timeframe_label": "long_term",
            "estimated_range": "up to about 1 year"
        }
    }

    return timeframe_details.get(timestep, {
        "timeframe_label": "unknown",
        "estimated_range": "unknown"
    })


def build_timeseries_analysis(item_id, timestep, timeseries_data):
    raw_points = timeseries_data.get("data", [])

    if not raw_points:
        return None

    df = pd.DataFrame(raw_points)

    if df.empty:
        return None

    df["average_price"] = df.apply(get_midpoint_price, axis=1)
    df["volume"] = df.apply(get_total_volume, axis=1)

    df = df.dropna(subset=["average_price"])

    if df.empty:
        return None

    df = df.sort_values("timestamp")

    starting_price = int(df["average_price"].iloc[0])
    ending_price = int(df["average_price"].iloc[-1])

    price_change = ending_price - starting_price
    percent_change = round((price_change / starting_price) * 100, 2)

    average_price = int(round(df["average_price"].mean()))
    support_price = int(df["average_price"].min())
    resistance_price = int(df["average_price"].max())
    average_volume = int(round(df["volume"].mean()))

    volatility_percent = 0

    if len(df) > 1 and average_price:
        volatility_percent = round(
            (df["average_price"].std() / average_price) * 100,
            2
        )

    chart_points = []

    for _, row in df.iterrows():
        chart_points.append({
            "timestamp": int(row["timestamp"]),
            "average_price": int(row["average_price"]),
            "volume": int(row["volume"])
        })

    timeframe_details = get_timeframe_details(timestep)

    return {
        "item_id": item_id,
        "timestep": timestep,
        "timeframe_label": timeframe_details["timeframe_label"],
        "estimated_range": timeframe_details["estimated_range"],
        "data_points": len(chart_points),
        "trend_direction": get_trend_direction(percent_change),
        "starting_price": starting_price,
        "ending_price": ending_price,
        "price_change": price_change,
        "percent_change": percent_change,
        "average_price": average_price,
        "support_price": support_price,
        "resistance_price": resistance_price,
        "average_volume": average_volume,
        "volatility_percent": volatility_percent,
        "chart_points": chart_points
    }