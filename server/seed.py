import os

from app import app
from models import db, User, Position, WatchlistItem


def clear_database():
    WatchlistItem.query.delete()
    Position.query.delete()
    User.query.delete()

    db.session.commit()


def create_user(username, email, password):
    user = User(
        username=username,
        email=email
    )
    user.password = password

    db.session.add(user)
    db.session.commit()

    return user


def create_seed_data():
    demo_one = create_user(
        username="demo_user_one",
        email="demo1@example.com",
        password="password123"
    )

    demo_two = create_user(
        username="demo_user_two",
        email="demo2@example.com",
        password="password123"
    )

    db.session.add_all([
        Position(
            item_id=24268,
            item_name="Basilisk jaw",
            quantity=1,
            buy_price=15383064,
            notes="Long-term price watch position",
            user_id=demo_one.id
        ),
        Position(
            item_id=19553,
            item_name="Amulet of torture",
            quantity=2,
            buy_price=20800000,
            notes="Testing high-value jewelry tracking",
            user_id=demo_one.id
        ),
        Position(
            item_id=13576,
            item_name="Dragon warhammer",
            quantity=1,
            buy_price=48000000,
            notes="Spec weapon market watch",
            user_id=demo_two.id
        ),
        Position(
            item_id=28810,
            item_name="Zombie axe",
            quantity=5,
            buy_price=1500000,
            notes="Lower-cost item position",
            user_id=demo_two.id
        ),
        WatchlistItem(
            item_id=29580,
            item_name="Tormented synapse",
            notes="Watch for large price swings",
            user_id=demo_one.id
        ),
        WatchlistItem(
            item_id=26384,
            item_name="Torva platebody",
            notes="High-value PvM gear watch",
            user_id=demo_one.id
        ),
        WatchlistItem(
            item_id=11832,
            item_name="Bandos chestplate",
            notes="Common PvM gear item",
            user_id=demo_two.id
        ),
        WatchlistItem(
            item_id=21034,
            item_name="Dexterous prayer scroll",
            notes="Raid reward market watch",
            user_id=demo_two.id
        )
    ])

    db.session.commit()


if __name__ == "__main__":
    allow_seed = os.environ.get("ALLOW_SEED") == "true"

    if not allow_seed:
        raise RuntimeError(
            "Seeding is disabled. Set ALLOW_SEED=true to run this script intentionally."
        )

    with app.app_context():
        print("Clearing database...")
        clear_database()

        print("Creating seed data...")
        create_seed_data()

        print("Seed complete.")