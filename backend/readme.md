Free videos → build trust

Paid individual videos → low-friction entry

Paid playlist (bundle) → best deal, biggest value

i have to think about this
how should i construct business logic and rules
how it will collaborate with frontend what kind of branches i should make
especially for payment , video

------ business rules ----

1. Video visibility

Only PUBLISHED or UNLISTED videos are accessible

DRAFT and ARCHIVED are never accessible to users 

2) price = NULL

Always watchable if published

No purchase record required

Can belong to a playlist or be independent

At least 1 free video per playlist (recommended, not enforced)

3. price > 0

User must purchase video OR playlist

Purchase grants lifetime access (unless refunded)

Video can exist:

independently

inside a playlist

4. Playlist pricing rules

playlist.price is optional

If set:

buying playlist unlocks all videos inside

Playlist price is always:

lower than sum of paid videos (business rule, admin enforced)

User can watch a video IF:

1. video is PUBLISHED or UNLISTED
   AND
2. (
   video.price IS NULL
   OR user bought video
   OR (video has playlist AND user bought playlist)
   )

Video purchase

One purchase per user per video

Refund revokes access

Buying playlist later does NOT require re-buy

Playlist purchase

One purchase per user per playlist

Grants access to all current + future videos

Create free or paid videos

Move videos between playlists

Change prices (future purchases only)

Set playlist price

Remove access from already purchased users

Change video to DRAFT if users purchased (soft rule)

These are business rules, not DB constraints:

Playlist price < sum of paid videos

Playlist must contain:

free video at position #1

First paid video should not be most expensive

Show “You save X%” badge when playlist exists

Video card

Free → “Watch”

Paid → “Unlock $X”

Purchased → “Continue”

Playlist owned → “Included in your playlist”

Playlist page

Show:

total value of videos

bundle price

savings
