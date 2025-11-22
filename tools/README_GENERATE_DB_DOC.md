Generate database schema Word document

This small utility converts the database schema definitions into a Word document (`.docx`) with tables you can paste into Word or share.

Prerequisites

- Python 3.9+
- pip

Install dependency

```powershell
pip install python-docx
```

Run

```powershell
# from project root
python tools\generate_db_doc.py    # creates database_schema.docx in project root

# or specify output path
python tools\generate_db_doc.py docs\database_schema.docx
```

Output

- `database_schema.docx` by default (in project root)

Notes

- The script is intentionally small and self-contained. If you need different styling (fonts, table styles), tell me and I can update it.
