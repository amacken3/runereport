from urllib.parse import quote


def build_icon_url(icon):
    if not icon:
        return None

    formatted_icon = quote(icon.replace(" ", "_"))

    return f"https://oldschool.runescape.wiki/images/{formatted_icon}"