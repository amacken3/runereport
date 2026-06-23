GE_TAX_RATE = 0.02
GE_TAX_CAP = 5_000_000
TAX_EXEMPT_ITEM_NAMES = {"old school bond"}


def is_tax_exempt_item(item_name=""):
    return item_name.lower() in TAX_EXEMPT_ITEM_NAMES


def calculate_ge_tax(sell_price, item_name=""):
    if not sell_price:
        return 0

    if is_tax_exempt_item(item_name):
        return 0

    return min(int(sell_price * GE_TAX_RATE), GE_TAX_CAP)


def calculate_after_tax_value(sell_price, item_name=""):
    if not sell_price:
        return {
            "ge_tax": 0,
            "after_tax_value": None
        }

    tax = calculate_ge_tax(sell_price, item_name)

    return {
        "ge_tax": tax,
        "after_tax_value": sell_price - tax
    }


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


def build_top_movers(mapping_data, latest_data, hourly_data):
    item_lookup = {str(item["id"]): item for item in mapping_data}

    latest_prices = latest_data.get("data", {})
    hourly_prices = hourly_data.get("data", {})

    movers = []

    for item_id, hourly_item in hourly_prices.items():
        latest_item = latest_prices.get(item_id)

        if not latest_item:
            continue

        item_info = item_lookup.get(item_id)

        if not item_info:
            continue

        item_name = item_info.get("name", "")

        if is_tax_exempt_item(item_name):
            continue

        current_price = latest_item.get("high") or latest_item.get("low")
        average_price = (
            hourly_item.get("avgHighPrice") or
            hourly_item.get("avgLowPrice")
        )

        volume = (
            hourly_item.get("highPriceVolume", 0) +
            hourly_item.get("lowPriceVolume", 0)
        )

        if not current_price or not average_price:
            continue

        if average_price < 1000 or current_price < 1000:
            continue

        if volume < 50:
            continue

        price_change = current_price - average_price
        percent_change = (price_change / average_price) * 100

        movers.append({
            "item_id": int(item_id),
            "item_name": item_name,
            "icon": item_info.get("icon"),
            "current_price": current_price,
            "average_price": average_price,
            "price_change": price_change,
            "percent_change": round(percent_change, 2),
            "volume": volume
        })

    top_gainers = sorted(
        movers,
        key=lambda item: item["price_change"],
        reverse=True
    )[:10]

    top_losers = sorted(
        movers,
        key=lambda item: item["price_change"]
    )[:10]

    return {
        "top_gainers": top_gainers,
        "top_losers": top_losers
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

    item_name = item_info.get("name", "")
    current_price = get_current_price(latest_item)

    raw_sell_price = latest_item.get("low")
    tax_data = calculate_after_tax_value(
        sell_price=raw_sell_price,
        item_name=item_name
    )

    one_hour_average = get_average_price(hourly_item) if hourly_item else None
    daily_average = get_average_price(daily_item) if daily_item else None

    one_hour_change = calculate_price_change(current_price, one_hour_average)
    daily_change = calculate_price_change(current_price, daily_average)

    one_hour_volume = 0

    if hourly_item:
        one_hour_volume = (
            hourly_item.get("highPriceVolume", 0) +
            hourly_item.get("lowPriceVolume", 0)
        )

    return {
        "item_id": item_id,
        "item_name": item_name,
        "icon": item_info.get("icon"),
        "examine": item_info.get("examine"),
        "members": item_info.get("members"),
        "limit": item_info.get("limit"),
        "current_price": current_price,
        "latest_high": latest_item.get("high"),
        "latest_low": latest_item.get("low"),
        "raw_sell_price": raw_sell_price,
        "estimated_ge_tax": tax_data["ge_tax"],
        "after_tax_sell_value": tax_data["after_tax_value"],
        "one_hour_average": one_hour_average,
        "daily_average": daily_average,
        "one_hour_price_change": one_hour_change["price_change"],
        "one_hour_percent_change": one_hour_change["percent_change"],
        "daily_price_change": daily_change["price_change"],
        "daily_percent_change": daily_change["percent_change"],
        "one_hour_volume": one_hour_volume
    }