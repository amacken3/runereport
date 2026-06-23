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