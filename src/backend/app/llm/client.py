"""LLM layer — narrative generation and chatbot.

Hard constraint: the LLM **never** determines a score. It only
explains or personalises a result the deterministic scoring engine
already computed. This module must compile and the LLM must be
optional — the deterministic report path must work if the LLM is down.
"""

from __future__ import annotations

import logging
import json
from typing import Any

from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMUnavailable(RuntimeError):
    """Raised when the LLM API cannot be reached."""


class LLMClient:
    """Thin wrapper around the Qwen Cloud (Alibaba DashScope) API.

    Uses the OpenAI-compatible endpoint exposed by DashScope. The underlying
    SDK is lazy-loaded so the module imports even when `openai` is missing.
    """

    def __init__(self) -> None:
        self._client: Any | None = None

    def _get_client(self) -> Any:
        if self._client is None:
            try:
                from openai import OpenAI  # type: ignore[import-not-found]
            except ImportError as e:
                raise LLMUnavailable(
                    "openai package not installed; cannot call LLM"
                ) from e
            if not settings.qwen_api_key:
                raise LLMUnavailable("QWEN_API_KEY not set")
            self._client = OpenAI(
                api_key=settings.qwen_api_key,
                base_url=settings.qwen_base_url,
            )
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
            msg = client.chat.completions.create(
                model=settings.qwen_model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system},
                    {
                        "role": "user",
                        "content": f"Report payload:\n{report_payload}",
                    },
                ],
            )
            content = getattr(msg.choices[0].message, "content", "") or ""
            return content.strip() or _fallback_narrative(report_payload)
        except Exception as e:
            logger.warning("LLM unavailable, using fallback narrative: %s", e)
            return _fallback_narrative(report_payload)

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(min=1, max=3))
    def generate_diagnosis(self, system_prompt: str, user_prompt: str) -> dict:
        """Generate a structured diagnosis (per-pillar + overall) as JSON.

        The caller is responsible for building the prompt (see
        :mod:`app.diagnosis.prompt`). This method only performs the model call
        and parses the JSON response.

        Raises:
            LLMUnavailable / JSONDecodeError: on failure, so the caller can fall
            back to the deterministic diagnosis builder.
        """
        client = self._get_client()
        try:
            msg = client.chat.completions.create(
                model=settings.qwen_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.4,
            )
            content = getattr(msg.choices[0].message, "content", "") or ""
            parsed = json.loads(content)
            if not isinstance(parsed, dict) or "pillars" not in parsed:
                raise ValueError("LLM diagnosis missing required 'pillars' key")
            parsed.setdefault("is_fallback", False)
            return parsed
        except Exception as e:  # noqa: BLE001 - propagated to deterministic fallback
            logger.warning("LLM diagnosis failed, falling back: %s", e)
            raise


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
