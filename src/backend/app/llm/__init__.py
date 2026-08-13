"""LLM client — narrative generation only. Never determines a score."""

from app.llm.client import LLMUnavailable, llm_client

__all__ = ["LLMUnavailable", "llm_client"]
