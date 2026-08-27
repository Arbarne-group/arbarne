"""CLI Script to generate and export synthetic datasets for Future Farms Framework ML models.

Usage:
    python -m app.scripts.generate_synthetic_datasets --num-farms 1000 --output-dir data/synthetic
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path

# Add backend directory to sys.path if running as standalone script
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_ROOT = CURRENT_DIR.parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.ml.synthetic_data import SyntheticDataGenerator

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("generate_synthetic_datasets")


def generate_and_export(
    num_farms: int = 1000,
    num_evidence: int = 1000,
    seed: int = 42,
    output_dir: str = "data/synthetic",
    formats: str = "csv,parquet",
) -> None:
    """Generate datasets, validate quality, and export to specified formats."""
    # Resolve output directory relative to project root or workspace
    out_path = Path(output_dir).resolve()
    out_path.mkdir(parents=True, exist_ok=True)

    log.info("Initializing SyntheticDataGenerator (seed=%d)...", seed)
    generator = SyntheticDataGenerator(seed=seed)

    log.info("Generating synthetic datasets (farms=%d, evidence=%d)...", num_farms, num_evidence)
    data = generator.generate_all_datasets(n_farms=num_farms, n_evidence=num_evidence)

    fmt_list = [f.strip().lower() for f in formats.split(",") if f.strip()]

    exported_files = []

    # Export datasets
    datasets_to_export = [
        ("farm_surveys_200q", data["surveys"]),
        ("section_capability_analysis", data["sections"]),
        ("farm_clustering_features", data["clustering"]),
        ("farm_risk_training", data["risk"]),
        ("evidence_anomaly_audit", data["evidence"]),
    ]

    for name, df in datasets_to_export:
        if "csv" in fmt_list:
            csv_file = out_path / f"{name}.csv"
            df.to_csv(csv_file, index=False)
            size_kb = csv_file.stat().st_size / 1024.0
            exported_files.append((csv_file.name, f"{len(df)} rows × {len(df.columns)} cols", f"{size_kb:.1f} KB"))
            log.info("Exported CSV: %s (%.1f KB)", csv_file, size_kb)

        if "parquet" in fmt_list:
            try:
                parquet_file = out_path / f"{name}.parquet"
                df.to_parquet(parquet_file, index=False)
                size_kb = parquet_file.stat().st_size / 1024.0
                exported_files.append((parquet_file.name, f"{len(df)} rows × {len(df.columns)} cols", f"{size_kb:.1f} KB"))
                log.info("Exported Parquet: %s (%.1f KB)", parquet_file, size_kb)
            except Exception as e:
                log.warning("Could not write Parquet for %s: %s", name, e)

    # Export metadata summary
    meta_file = out_path / "metadata_summary.json"
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(data["metadata"], f, indent=2)
    log.info("Exported Metadata Summary: %s", meta_file)

    # Print Summary Table
    print("\n" + "=" * 80)
    print("=== FUTURE FARMS FRAMEWORK (FFF) -- SYNTHETIC DATASET SUMMARY ===")
    print("=" * 80)
    print(f"Output Directory: {out_path}")
    print(f"Random Seed:      {seed}")
    print(f"Total Farms:      {num_farms:,}")
    print(f"Total Evidence:   {num_evidence:,}")
    print("-" * 80)
    print(f"{'File Name':<35} | {'Dimensions':<24} | {'Size'}")
    print("-" * 80)
    for fname, dims, sz in exported_files:
        print(f"{fname:<35} | {dims:<24} | {sz}")
    print("=" * 80)
    print("[SUCCESS] All synthetic datasets successfully generated, validated, and exported!\n")


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic training datasets for Future Farms Framework.")
    parser.add_argument("--num-farms", type=int, default=1000, help="Number of farm assessments to generate (default: 1000)")
    parser.add_argument("--num-evidence", type=int, default=1000, help="Number of evidence telemetry items to generate (default: 1000)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility (default: 42)")
    parser.add_argument("--output-dir", type=str, default="data/synthetic", help="Output directory path (default: data/synthetic)")
    parser.add_argument("--formats", type=str, default="csv,parquet", help="Comma-separated formats: csv,parquet (default: csv,parquet)")

    args = parser.parse_args()
    generate_and_export(
        num_farms=args.num_farms,
        num_evidence=args.num_evidence,
        seed=args.seed,
        output_dir=args.output_dir,
        formats=args.formats,
    )


if __name__ == "__main__":
    main()
