from schemas.user_schema import UserSchema
from schemas.position_schema import PositionSchema
from schemas.watchlist_schema import WatchlistSchema


user_schema = UserSchema()
users_schema = UserSchema(many=True)

position_schema = PositionSchema()
positions_schema = PositionSchema(many=True)

watchlist_schema = WatchlistSchema()
watchlists_schema = WatchlistSchema(many=True)