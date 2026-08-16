"""Job entry point for the durable two-speed ingest lifecycle."""

from __future__ import annotations

import argparse

from app.ingestion import IngestionCoordinator


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--job-id", required=True)
    args = parser.parse_args()
    coordinator = IngestionCoordinator()
    coordinator.run_fast(args.job_id)
    coordinator.run_deep(args.job_id)


if __name__ == "__main__":
    main()
