from typing import Annotated

from fastapi import APIRouter, Depends, Path

from ..clients.sales import SalesClient
from ..config import Settings
from ..dependencies import get_sales_client
from ..models import PaymentRequest, PaymentTerminalRequest, PaymentAppClaimRequest

router = APIRouter(prefix=f"{Settings().api_base_path}/payments", tags=["payments"])

# Sales API IDs are opaque tokens; this only blocks characters ('/', '?', '#', ...)
# that would let a path segment be mistaken for extra path/query structure downstream.
IdParam = Annotated[str, Path(pattern=r"^[A-Za-z0-9_-]+$")]


@router.post("")
async def create_payment(
    request: PaymentRequest,
    client: SalesClient = Depends(get_sales_client),
):
    return await client.create_payment(request.model_dump(by_alias=True, exclude_none=True))


@router.post("/{payment_id}/transactions/{transaction_id}/terminal")
async def start_terminal(
    payment_id: IdParam,
    transaction_id: IdParam,
    request: PaymentTerminalRequest,
    client: SalesClient = Depends(get_sales_client),
):
    return await client.start_terminal_session(
        payment_id,
        transaction_id,
        request.model_dump(by_alias=True, exclude_none=True),
    )


@router.post("/{payment_id}/transactions/{transaction_id}/app-claim")
async def start_app_claim(
    payment_id: IdParam,
    transaction_id: IdParam,
    request: PaymentAppClaimRequest,
    client: SalesClient = Depends(get_sales_client),
):
    return await client.start_app_claim_session(
        payment_id,
        transaction_id,
        request.model_dump(by_alias=True, exclude_none=True),
    )


@router.put("/{payment_id}/transactions/{transaction_id}/capture")
async def capture_transaction(
    payment_id: IdParam,
    transaction_id: IdParam,
    client: SalesClient = Depends(get_sales_client),
):
    return await client.capture_transaction(payment_id, transaction_id)


@router.get("/{payment_id}/transactions/{transaction_id}")
async def get_transaction(
    payment_id: IdParam,
    transaction_id: IdParam,
    client: SalesClient = Depends(get_sales_client),
):
    return await client.get_transaction(payment_id, transaction_id)
