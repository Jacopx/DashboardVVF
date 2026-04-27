from datetime import date, timedelta
from fastapi import APIRouter
from datetime import date


router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.get("/{year}")
async def get_calendar(year: int):
    return get_weekend_shifts(year)


def get_weekend_shifts(year: int) -> list[dict]:
    """
    Returns all weekend days of the year with their assigned shift number.
    """
    PATTERN = [
        (4, 3),
        (1, 2),
        (3, 4),
        (2, 1),
    ]

    result = []
    d = date(year, 1, 1)

    while d.weekday() != 5:
        d += timedelta(days=1)

    weekend_index = 0
    while d.year == year:
        saturday = d
        sunday = d + timedelta(days=1)

        sat_shift, sun_shift = PATTERN[weekend_index % 4]

        result.append({"date": saturday, "day": "sabato", "shift": sat_shift})
        if sunday.year == year:
            result.append({"date": sunday, "day": "domenica", "shift": sun_shift})

        d += timedelta(days=7)
        weekend_index += 1

    return result
