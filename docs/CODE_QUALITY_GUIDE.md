# CODE_QUALITY_GUIDE.md  --  FFF Digital Platform Code Quality Standards

> **Standards and conventions for maintaining code quality in the Future Farms Framework platform.**
> 
> This guide documents the type annotation, import, and linting conventions used across the codebase,
> along with procedures for keeping them up to date.

---

## 1. Type Annotation Standards

All Pydantic models and Python code must follow modern Python type annotation conventions.
Deprecated forms must be replaced promptly.

### 1.1 `typing.Dict` / `typing.List` → `dict` / `list`

The `typing.Dict` and `typing.List` forms are deprecated in Python 3.9+ in favor of the
builtin `dict` and `list` generic types.

**Rule:** Replace all `typing.Dict[...]` with `dict[...]` and `typing.List[...]` with `list[...]`.

**Files requiring conversion (based on ruff analysis):**

| File | Issue Count | Example |
|---|---|---|
| `src/backend/app/schemas/gamification.py` | `typing.Dict` at line 6, `typing.List` at line 6, plus multiple UP006/UP035 errors | `from typing import Any, Dict, List, Optional` → `from typing import Any, Optional` |
| `src/backend/app/schemas/portal.py` | `typing.Dict` at line 6, `typing.List` at line 6, plus multiple UP035/UP006/F401 errors | `from typing import Any, Dict, List, Optional` → `from typing import Any, Optional` |
| `src/backend/app/schemas/auth.py` | `UP045` — `Optional[X]` → `X | None` conversions (6 occurrences) | `phone: Optional[str]` → `phone: str | None` |

**Conversion commands:**

```bash
# Replace typing.Dict with dict
sed -i 's/typing.Dict\[/dict\[/g' src/backend/app/schemas/*.py

# Replace typing.List with list
sed -i 's/typing.List\[/list\[/g' src/backend/app/schemas/*.py

# Update imports: remove Dict, List from typing imports if they're no longer used
```

### 1.2 `Optional[X]` → `X | None`

Use the pipe-separated form `X | None` instead of `Optional[X]` for type annotations.

**Affected files:** `src/backend/app/schemas/auth.py`, `src/backend/app/schemas/portal.py`

**Example conversions (from ruff output):**

| Before | After |
|---|---|
| `phone: Optional[str]` | `phone: str | None` |
| `role: str` | unchanged (no Optional) |
| `email: Optional[EmailStr]` | `email: EmailStr | None` |
| `farm_id: Optional[UUID] = None` | `farm_id: UUID | None = None` |
| `farm_name: Optional[str] = None` | `farm_name: str | None = None` |

### 1.3 `Optional[]` without `= None`

When a field has `Optional[X]` but no default value of `None`, it should either:
- Get a default of `None`: `field: X | None = None`
- Or keep `Optional[X]` but ensure it's intentional

**Ruff hint:** UP045 flags `Optional[X]` → `X | None` conversions.

---

## 2. Import Organization

Imports must be sorted and formatted using `isort` with the project configuration.

### 2.1 Import Groups (per `pyproject.toml` `[tool.ruff.lint.isort]`)

- `known-first-party = ["app", "tests"]`
- Standard library imports first
- Related third-party imports
- First-party imports last

### 2.2 F401: Unused Import Removal

Remove any imported name that is not used in the file.

**Common violations found:**
- `typing.Any` imported but unused in `src/backend/app/schemas/portal.py:6`
- `typing.Dict` imported but unused in `src/backend/app/schemas/portal.py:6`
- `typing.List` imported but unused in `src/backend/app/schemas/portal.py:6`
- `os` imported but unused in `generate_synthetic_datasets.py`

**Action:** Remove unused imports and re-run isort.

### 2.3 Running isort

```bash
# From the project root, with venv activated
.\.venv\Scripts\ruff check --select I src/backend/
# Or explicitly
.\.venv\Scripts\isort src/backend/app/schemas/*.py
```

---

## 3. Linting with Ruff

Ruff checks should pass before any PR is merged.

### 3.1 Running Ruff

```bash
# Check all issues
.ruv\Scripts\ruff check src/backend/

# Fix auto-fixable issues
.ruv\Scripts\ruff check --fix src/backend/

# Lint with mypy integration
.ruv\Scripts\ruff check --select UP src/backend/
```

### 3.2 Key Ruff Check Codes

| Code | Meaning | Action |
|---|---|---|
| `UP006` | Use `list` instead of `List` | Convert `List[Foo]` to `list[Foo]` |
| `UP035` | `typing.Dict` is deprecated, use `dict` | Convert `Dict[K, V]` to `dict[K, V]` |
| `UP045` | Use `X | None` for type annotations | Convert `Optional[X]` to `X | None` |
| `F401` | Imported name unused | Remove the import |

### 3.3 MyPy Integration

```bash
# Run mypy with project config
.\.venv\Scripts\mypy src/backend/app/ --ignore-missing-imports

# Common mypy errors and fixes:
# - "No overload variant of 'get' of 'dict' matches argument types 'int', 'float'"
#   → Ensure dict keys match expected types; avoid mixing int/float keys
# - "Unsupported operand types for * ('None' and 'int')"
#   → Initialize variables or use `x or 0` / `x if x is not None else 0`
# - "Argument 'farm_name' to 'generate_transformation_pdf' has incompatible type 'str | None'"
#   → Ensure optional args are handled; use `Optional[str]` or `str | None` consistently
```

---

## 4. Test Quality Standards

All test files in `src/backend/tests/` must maintain passing status.

### 4.1 Minimum Passing Tests

- **36 unit/integration tests** must pass (as verified in HANDOVER.md)
- **Scoring engine tests** (`tests/test_scoring.py`): at least 33 tests passing
- All tests must be deterministic — same inputs produce same outputs

### 4.2 Test Data Isolation

Each test should create its own `assessment` row with a UUID to avoid flaky tests.

**Anti-pattern:** Sharing database state between tests

**Pattern:** Use pytest fixtures with `uuid4()` for assessment IDs

---

## 5. Maintenance Procedures

### 5.1 Periodic Code Quality Review

Run the following before each release:

```bash
# 1. Update type annotations
ruff check --select UP006,UP035,UP045 src/backend/

# 2. Fix imports
isort src/backend/app/

# 3. Run mypy
mypy src/backend/app/ --ignore-missing-imports

# 4. Run test suite
.venv\Scripts\pytest src/backend/tests/ -v
```

### 5.2 Deprecation Timeline

| Issue | Target Resolution | Owner |
|---|---|---|
| `typing.Dict` → `dict` | Next sprint | All developers |
| `typing.List` → `list` | Next sprint | All developers |
| `Optional[X]` → `X | None` | Next sprint | All developers |
| Full ruff clean | Release 0.2.0 | Lead developer |

---

## 6. References

- `pyproject.toml` — project-level ruff/mypy/pytest configuration
- `HANDOVER.md` — verified milestone completion matrix
- `SETUP.md` — local development setup guide
- `DECISIONS.md` — project decision log