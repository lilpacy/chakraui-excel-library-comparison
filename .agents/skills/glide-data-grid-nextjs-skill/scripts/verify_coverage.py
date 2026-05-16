#!/usr/bin/env python3
"""Simple coverage check for the glide-data-grid-nextjs Skill.

This script verifies that the Skill reference files mention the core Glide Data Grid
components, all standard GridCellKind names, and all additional cell renderers from
@glideapps/glide-data-grid-cells.
"""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
TEXT = "\n".join(
    path.read_text(encoding="utf-8")
    for path in ROOT.rglob("*.md")
    if ".git" not in path.parts
)

REQUIRED_TERMS = {
    "standard GridCellKind": [
        "Text",
        "Number",
        "Boolean",
        "Uri",
        "Image",
        "Markdown",
        "Bubble",
        "Drilldown",
        "RowID",
        "Protected",
        "Loading",
        "Custom",
    ],
    "special/internal cells": [
        "Marker",
        "NewRow",
    ],
    "core components/exports": [
        "DataEditor",
        "DataEditorCore",
        "DataEditorRef",
        "ImageOverlayEditor",
        "MarkdownDiv",
        "TextCellEntry",
        "AllCellRenderers",
        "useTheme",
        "getDefaultTheme",
        "useColumnSizer",
        "useRowGrouping",
    ],
    "additional cells": [
        "StarCell",
        "SparklineCell",
        "TagsCell",
        "UserProfileCell",
        "DropdownCell",
        "ArticleCell",
        "RangeCell",
        "SpinnerCell",
        "DatePickerCell",
        "LinksCell",
        "ButtonCell",
        "TreeViewCell",
        "MultiSelectCell",
        "allCells",
    ],
    "Next.js setup": [
        "use client",
        "ssr: false",
        "dynamic",
        "@glideapps/glide-data-grid/dist/index.css",
        "#portal",
        "App Router",
        "Pages Router",
    ],
}

missing: dict[str, list[str]] = {}
for category, terms in REQUIRED_TERMS.items():
    absent = [term for term in terms if term not in TEXT]
    if absent:
        missing[category] = absent

if missing:
    print("Coverage check failed. Missing terms:")
    for category, terms in missing.items():
        print(f"- {category}: {', '.join(terms)}")
    sys.exit(1)

print("Coverage check passed.")
for category, terms in REQUIRED_TERMS.items():
    print(f"- {category}: {len(terms)} terms")
