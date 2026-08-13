"""LLM layer — narrative generation and chatbot.

Hard constraint: the LLM **never** determines a score. It only
explains or personalises a result the deterministic scoring engine
already computed. This module must compile and the LLM must be
optional — the deterministic report path must work if the LLM is down.
"""

from __future__ import annotations

import logging
from typing import Any

from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMUnavailable(RuntimeError):
    """Raised when the LLM API cannot be reached."""


class LLMClient:
    """Thin wrapper around the Anthropic Claude API.

    Lazy-loaded; the underlying SDK is only imported when actually called.
    """

    def __init__(self) -> None:
        self._client: Any | None = None

    def _get_client(self) -> Any:
        if self._client is None:
            try:
                from anthropic import Anthropic  # type: ignore[import-not-found]
            except ImportError as e:
                raise LLMUnavailable(
                    "anthropic package not installed; cannot call LLM"
                ) from e
            if not settings.anthropic_api_key:
                raise LLMUnavailable("ANTHROPIC_API_KEY not set")
            self._client = Anthropic(api_key=settings.anthropic_api_key)
        return self._client

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=4))
    def generate_narrative(self, report_payload: dict) -> str:
        """Generate a narrative summary for the Farm Transformation Report.

        Args:
            report_payload: the deterministic report payload (already
                produced by the scoring + recommendation engines). The LLM
                is asked to *summarise and personalise*, not to redefine
                any field.

        Returns:
            Narrative text. On failure, returns a deterministic fallback
            so the report still renders.
        """
        try:
            client = self._get_client()
            system = (
                "You are a friendly advisor for the Future Farms Framework. "
                "Summarise the provided report payload in plain language for a "
                "smallholder farmer. Never alter scores, recommendations, or "
                "priorities — only rephrase and connect them."
            )
            msg = client.messages.create(
                model=settings.anthropic_model,
                max_tokens=1024,
                system=system,
                messages=[
                    {
                        "role": "user",
                        "content": f"Report payload:\n{report_payload}",
                    }
                ],
            )
            # The SDK returns content as a list of typed blocks.
            blocks = getattr(msg, "content", []) or []
            text_parts = [getattr(b, "text", "") for b in blocks if getattr(b, "type", "") == "text"]
            return "\n".join(text_parts).strip() or _fallback_narrative(report_payload)
        except Exception as e:
            logger.warning("LLM unavailable, using fallback narrative: %s", e)
            return _fallback_narrative(report_payload)


def _fallback_narrative(payload: dict) -> str:
    """Deterministic narrative used when the LLM is unavailable."""
    tier = payload.get("tier_classification", "Unknown")
    score = payload.get("ffmi_score", 0)
    return (
        f"Your farm is currently classified as a {tier} "
        f"(FFMI score {score}/24). "
        "Focus on the Quick Wins first to build momentum, then plan for "
        "the Medium-Term and Strategic actions in the order shown."
    )


# Module-level singleton
llm_client = LLMClient()
