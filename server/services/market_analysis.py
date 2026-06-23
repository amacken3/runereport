def find_item_info(item_id, mapping_data):
    for item in mapping_data:
        if item.get("id") == item_id:
            return item

    return None


def get_average_price(price_data):
    high_price = price_data.get("avgHighPrice")
    low_price = price_data.get("avgLowPrice")

    if high_price and low_price:
        return round((high_price + low_price) / 2)

    return high_price or low_price


def get_current_price(price_data):
    high_price = price_data.get("high")
    low_price = price_data.get("low")

    if high_price and low_price:
        return round((high_price + low_price) / 2)

    return high_price or low_price


def calculate_price_change(current_price, average_price):
    if not current_price or not average_price:
        return {
            "price_change": None,
            "percent_change": None
        }

    price_change = current_price - average_price
    percent_change = (price_change / average_price) * 100

    return {
        "price_change": price_change,
        "percent_change": round(percent_change, 2)
    }

def build_market_analysis(item_id, mapping_data, latest_data, hourly_data, daily_data):
    item_info = find_item_info(item_id, mapping_data)

    if not item_info:
        return None

    item_id_key = str(item_id)

    latest_item = latest_data.get("data", {}).get(item_id_key)
    hourly_item = hourly_data.get("data", {}).get(item_id_key)
    daily_item = daily_data.get("data", {}).get(item_id_key)

    if not latest_item:
        return None

    current_price = get_current_price(latest_item)

    one_hour_average = get_average_price(hourly_item) if hourly_item else None
    daily_average = get_average_price(daily_item) if daily_item else None

    one_hour_change = calculate_price_change(current_price, one_hour_average)
    daily_change = calculate_price_change(current_price, daily_average)

    volume = 0

    if hourly_item:
        volume = (
            hourly_item.get("highPriceVolume", 0) +
            hourly_item.get("lowPriceVolume", 0)
        )

    return {
        "item_id": item_id,
        "item_name": item_info.get("name"),
        "icon": item_info.get("icon"),
        "examine": item_info.get("examine"),
        "members": item_info.get("members"),
        "limit": item_info.get("limit"),
        "current_price": current_price,
        "latest_high": latest_item.get("high"),
        "latest_low": latest_item.get("low"),
        "one_hour_average": one_hour_average,
        "daily_average": daily_average,
        "one_hour_price_change": one_hour_change["price_change"],
        "one_hour_percent_change": one_hour_change["percent_change"],
        "daily_price_change": daily_change["price_change"],
        "daily_percent_change": daily_change["percent_change"],
        "one_hour_volume": volume
    }