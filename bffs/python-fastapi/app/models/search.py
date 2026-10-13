from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field
from .omsa import (
    PlaceReference,
    TravelSpecification,
    IndividualTraveller,
    SearchOfferInput1,
)


class SearchOfferInputs(SearchOfferInput1):
    pass

class SearchOfferRequest(BaseModel):
    inputs: SearchOfferInputs

    model_config = {"populate_by_name": True}

    def cache_payload(self) -> dict:
        """Payload used to compute cache keys."""

        return self.model_dump(by_alias=True, exclude_none=True, mode="json")
