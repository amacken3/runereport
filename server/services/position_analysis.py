from services.market_analysis import calculate_after_tax_value, find_item_info


def build_position_analysis(position, mapping_data, latest_data):
    item_id_key = str(position.item_id)

    latest_item = latest_data.get("data", {}).get(item_id_key)

    if not latest_item:
        return None

    item_info = find_item_info(position.item_id, mapping_data)

    item_name = position.item_name

    if item_info:
        item_name = item_info.get("name", position.item_name)

    quantity = position.quantity
    buy_price = position.buy_price

    raw_sell_price = latest_item.get("low")

    tax_data = calculate_after_tax_value(
        sell_price=raw_sell_price,
        item_name=item_name
    )

    total_cost = buy_price * quantity

    total_raw_sell_value = None
    total_after_tax_value = None
    estimated_profit_before_tax = None
    estimated_profit_after_tax = None

    if raw_sell_price:
        total_raw_sell_value = raw_sell_price * quantity
        estimated_profit_before_tax = total_raw_sell_value - total_cost

    if tax_data["after_tax_value"]:
        total_after_tax_value = tax_data["after_tax_value"] * quantity
        estimated_profit_after_tax = total_after_tax_value - total_cost

    return {
        "position_id": position.id,
        "item_id": position.item_id,
        "item_name": item_name,
        "icon": item_info.get("icon") if item_info else None,
        "quantity": quantity,
        "buy_price": buy_price,
        "total_cost": total_cost,
        "latest_high": latest_item.get("high"),
        "latest_low": latest_item.get("low"),
        "raw_sell_price": raw_sell_price,
        "estimated_ge_tax_per_item": tax_data["ge_tax"],
        "after_tax_sell_value_per_item": tax_data["after_tax_value"],
        "total_raw_sell_value": total_raw_sell_value,
        "total_after_tax_value": total_after_tax_value,
        "estimated_profit_before_tax": estimated_profit_before_tax,
        "estimated_profit_after_tax": estimated_profit_after_tax
    }